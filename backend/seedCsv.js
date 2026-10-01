require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/competition';

const transformId = (doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
};

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  university: { type: String },
  has_checked_in: { type: Boolean, default: false }
}, { toJSON: { transform: transformId } });

const memberSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true },
  university_id: { type: String }
}, { toJSON: { transform: transformId } });

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing old data...');
    await Team.deleteMany({});
    await Member.deleteMany({});
    
    const results = [];
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Parsed ${results.length} rows from CSV`);
        
        for (const row of results) {
          try {
            const team = await Team.create({
              name: row.teamName,
              university: row.university
            });

            const membersToCreate = [];
            
            if (row.memberOneName && row.memberOneName.trim() !== '' && row.memberOneName !== 'Vacant') {
              membersToCreate.push({ team_id: team._id, name: row.memberOneName, university_id: row.memberOneUniversityId });
            }
            if (row.memberTwoName && row.memberTwoName.trim() !== '' && row.memberTwoName !== 'Vacant') {
              membersToCreate.push({ team_id: team._id, name: row.memberTwoName, university_id: row.memberTwoUniversityId });
            }
            if (row.memberThreeName && row.memberThreeName.trim() !== '' && row.memberThreeName !== 'Vacant') {
              membersToCreate.push({ team_id: team._id, name: row.memberThreeName, university_id: row.memberThreeUniversityId });
            }
            if (row.memberFourName && row.memberFourName.trim() !== '' && row.memberFourName !== 'Vacant') {
              membersToCreate.push({ team_id: team._id, name: row.memberFourName, university_id: row.memberFourUniversityId });
            }

            if (membersToCreate.length > 0) {
              await Member.insertMany(membersToCreate);
            }
            console.log(`Added team: ${team.name} with ${membersToCreate.length} members`);
          } catch (err) {
             console.error(`Error adding team ${row.teamName}:`, err);
          }
        }

        console.log('Finished seeding data from CSV.');
        process.exit(0);
      });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

seedData();
