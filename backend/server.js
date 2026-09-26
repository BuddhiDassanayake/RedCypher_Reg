require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/competition';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Schemas & Models
const transformId = (doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
};

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  university: { type: String },
  has_checked_in: { type: Boolean, default: false },
  photo_number: { type: String }
}, { toJSON: { transform: transformId } });

const memberSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true }
}, { toJSON: { transform: transformId } });

const attendanceSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  food_choice: { type: String, required: true },
  date: { type: String, required: true }
}, { toJSON: { transform: transformId } });

const Team = mongoose.model('Team', teamSchema);
const Member = mongoose.model('Member', memberSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Seeding function
async function seedDatabase() {
  try {
    const count = await Team.countDocuments();
    if (count === 0) {
      console.log('Seeding initial MongoDB data...');
      const teams = ['Alpha Wolves', 'Code Crushers', 'Bug Squashers'];
      
      for (const tName of teams) {
        const team = await Team.create({ name: tName });
        await Member.create({ team_id: team._id, name: `Alice ${tName}` });
        await Member.create({ team_id: team._id, name: `Bob ${tName}` });
        await Member.create({ team_id: team._id, name: `Charlie ${tName}` });
      }
      console.log('Seeding complete.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

// Routes
app.get('/api/teams', async (req, res) => {
  try {
    const query = req.query.q || '';
    const teams = await Team.find({ name: { $regex: query, $options: 'i' } });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/teams/:id/members', async (req, res) => {
  try {
    const members = await Member.find({ team_id: req.params.id });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { teamId, selections } = req.body;
    if (!selections || !Array.isArray(selections)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    const attendanceRecords = selections.map(sel => ({
      member_id: sel.memberId,
      food_choice: sel.foodChoice,
      date: today
    }));
    
    await Attendance.insertMany(attendanceRecords);
    
    let photoNumber = null;
    if (teamId) {
      photoNumber = Math.floor(1000 + Math.random() * 9000).toString();
      await Team.findByIdAndUpdate(teamId, { 
        has_checked_in: true,
        photo_number: photoNumber 
      });
    }
    
    res.json({ success: true, photoNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const records = await Attendance.find().populate({
      path: 'member_id',
      populate: { path: 'team_id' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/team/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    const members = await Member.find({ team_id: req.params.id });
    const attendance = await Attendance.find({ member_id: { $in: members.map(m => m._id) } });
    
    const membersData = members.map(m => {
      const att = attendance.find(a => a.member_id.toString() === m._id.toString());
      return {
        id: m.id,
        name: m.name,
        food_choice: att ? att.food_choice : 'None'
      };
    });
    
    res.json({ team, members: membersData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/team/:id', async (req, res) => {
  try {
    const { name, members } = req.body;
    
    if (name) {
      await Team.findByIdAndUpdate(req.params.id, { name });
    }
    
    const today = new Date().toISOString().split('T')[0];

    if (members && Array.isArray(members)) {
      const incomingIds = members.filter(m => m.id).map(m => m.id);
      
      // Delete removed members
      const existingMembers = await Member.find({ team_id: req.params.id });
      const membersToDelete = existingMembers.filter(m => !incomingIds.includes(m.id));
      for (const md of membersToDelete) {
        await Member.findByIdAndDelete(md._id);
        await Attendance.deleteMany({ member_id: md._id });
      }

      // Update or create members
      for (const m of members) {
        if (m.id) {
          await Member.findByIdAndUpdate(m.id, { name: m.name });
          const existingAtt = await Attendance.findOne({ member_id: m.id });
          if (existingAtt) {
             await Attendance.findByIdAndUpdate(existingAtt._id, { food_choice: m.food_choice });
          } else {
             await Attendance.create({ member_id: m.id, food_choice: m.food_choice, date: today });
          }
        } else {
          const newMember = await Member.create({ team_id: req.params.id, name: m.name });
          await Attendance.create({ member_id: newMember._id, food_choice: m.food_choice, date: today });
        }
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/reset', async (req, res) => {
  try {
    await Attendance.deleteMany({});
    await Team.updateMany({}, { has_checked_in: false, photo_number: null });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
