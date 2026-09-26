require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/competition';

// Schemas & Models
const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  university: { type: String },
  has_checked_in: { type: Boolean, default: false },
  photo_number: { type: String }
});

const memberSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true }
});

const attendanceSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  food_choice: { type: String, required: true },
  date: { type: String, required: true }
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

const teamsData = [
  { team: "Bonty_Hunt3R", university: "University of Ruhuna", members: ["Kavishka Chathuranga", "Ishini Shanika", "Pasan Madushanka", "Chamindu Lakshan"] },
  { team: "sudOps", university: "University of Ruhuna", members: ["Kavindu Sanjitha", "Jayashan Nawarathna", "Piyumal Sandeepa", "Mahesh Umayanga"] },
  { team: "The_Anonymous", university: "University of Ruhuna", members: ["Sachintha Pallegedara", "Sanjula Thilakarathne", "Pramith Evans", "Malith Wijayathilake"] },
  { team: "0xOverflow", university: "University of Ruhuna", members: ["Muflih Ahmes Junaid", "Dusheepan Pirabaharan", "Sanjeew Shewon Sivakant", "Logachandran Hirukshan"] },
  { team: "Hack_to_the_Future", university: "(SLIIT) Sri Lanka Institute", members: ["Hasitha Kodagoda", "Pomod Dissanayake", "Rishush Adithya", "Hasitha Yapa"] },
  { team: "GolD_Roger", university: "University of Kelaniya", members: ["Harsha Madhubashana", "GAVESH RANAWEERA", "DINETH THILANKA", "Himeth Iddamalgoda"] },
  { team: "Silent_Protocol", university: "University of Ruhuna", members: ["Rusiru Vinvidu", "Yasiru Nawodya", "Chamikara Herath", "Manura Yapa"] },
  { team: "Templars", university: "University of Kelaniya", members: ["Shaminda Hettiarachchi", "Wenura Mudalige", "Achintha Gamage", "Sandima Umayanjalee"] },
  { team: "TheByteForce", university: "University of Moratuwa", members: ["Nuwan Dhananjaya", "Savindu Dilshan", "Sahas Eashan", "Himeth Walgampaya"] },
  { team: "Team_PhaZto", university: "Other", members: ["Sithum Shihara", "Chanupa Chansidu", "Yasara Daneji", "Rasan Fernando"] },
  { team: "Cyber_Sparrows", university: "University of Ruhuna", members: ["Jathushihan K", "Aashik MSM", "Ahamed AJA", "Ahamed YS"] },
  { team: "404_D34D_DR0P", university: "Other", members: ["Sanidi Peiris", "Chamod Nisal", "Sanjitha Prabashwara"] },
  { team: "NXTRC", university: "University of Moratuwa", members: ["Inusha Thathsara Gunase", "Madhura Ravishan Abeywickr", "Janitha Jayasinghe", "Pabodha Samudini"] },
  { team: "CyBER_KNiGHtS", university: "University of Ruhuna", members: ["Uvin Nanayakkara", "Wishvajith Weerasingha", "Vinuka Oshadha", "Subodha Tharuka"] },
  { team: "cypher_ghost", university: "University of Kelaniya", members: ["Suresh Bhanuka", "Damindu Prasadith", "Prasindu Deshan", "Chamika Nimnajith"] },
  { team: "Cloud9", university: "University of Kelaniya", members: ["Kavishka Gayan", "Savithi Vinhara", "Sithum udara", "Movini Manavi"] },
  { team: "AGNI_404", university: "South Eastern University", members: ["Renue Branoz", "Madhusankha Nayanajith", "Adithya Srithika Sandiw", "Darshika Madhuhansani"] },
  { team: "Trojans_404", university: "University of Ruhuna", members: ["Hansana HAJ", "Ratnayake RMPM", "Ilmam IM", "Wanasinghe WMCOB"] },
  { team: "Vijaya", university: "University of Ruhuna", members: ["Manuthi Kasuntha", "Senanayake W S C M", "Silva TCK", "Rodrigo W A C C W"] },
  { team: "nova_nexus", university: "University of Ruhuna", members: ["Praveen Ethipola", "Supasan Geeganage", "Chethiya Kaushal", "Nimmitha Idirimana"] },
  { team: "403_privileged", university: "University of Moratuwa", members: ["RUSIRU SADATHANA", "JAINDU CHARINDITH", "SASITH INDUWARA", "DANANJAYA KUMARA"] },
  { team: "bytex_zero", university: "University of Ruhuna", members: ["Kavindu Premathilake", "Kalindu Jayathilaka", "Kasuntha Chackranga", "Nudeera Randuni"] },
  { team: "Team_Y2K", university: "University of Moratuwa", members: ["Teshan", "Thilakshan", "Saheththiyan"] },
  { team: "LO49", university: "(SLIIT) Sri Lanka Institute", members: ["Achin Chandrasiri", "Risadi Weerasinghe", "Pasidu Rajapaksha"] },
  { team: "Flag_Not_Found", university: "University of Ruhuna", members: ["Sachintha Shehara", "Upeksha Wijerathne", "Nisuli Weerasinghe", "Malshi Weerasinghe"] },
  { team: "CipherStorm", university: "University of Peradeniya", members: ["Vidusini Abesekara", "Nirod Nikeshala", "Hasala Kavinda"] },
  { team: "Cipher_Storm", university: "University of Ruhuna", members: ["Chathura Madushan", "Yashodha", "Oshan", "Sahan"] },
  { team: "Prevail_Stars", university: "Other", members: ["NM Roshaan Akther", "MNM Zaatheer", "MA Ammaar"] },
  { team: "deadlock", university: "University of Ruhuna", members: ["Wijayapala HMHL", "Nimalaweera NGCM", "JP Gamlath", "Bandara KMSN"] },
  { team: "raven", university: "University of Ruhuna", members: ["Benuka Mudalige", "Dilmi Prasadhi", "Nipuni liyange", "Sandaru Dilshan"] },
  { team: "Atronox", university: "(SLIIT) Sri Lanka Institute", members: ["Kavindu Sahan Silva", "Heshan Thenura Kariyawasam", "Janith Deshan Mihijaya Sa"] },
  { team: "Malware_Mafia", university: "University of Ruhuna", members: ["Rishitha Dilshan", "Tharun Hansitha", "Teshan Chamuditha"] },
  { team: "Cipher_Nexus", university: "University of Ruhuna", members: ["Senuk Yuthmika", "Dinithi Dilhara Withanapathira", "Suwanika", "Kamith Samaraweera"] },
  { team: "Root_Access", university: "University of Ruhuna", members: ["Koshihan", "Theshathree", "Rathnayaka", "Silva"] },
  { team: "Byte_Breach", university: "University of Ruhuna", members: ["Okith Moksha", "Muhammadh Hameez", "Muqshith Akbar", "Keshan Rathnayake"] },
  { team: "Dimension_C137", university: "University of Ruhuna", members: ["Yasith Buddhima", "Samuditha Asansa", "Rusiru Sulochana", "Duleepa Madushan"] },
  { team: "SabraX", university: "Sabaragamuwa University", members: ["KTDDM Jayathissa", "KH Madushnaka", "DCA Perera", "DMAKA Dissanayaka"] },
  { team: "QuantumX", university: "(KDU) General Sir John K", members: ["Kasun Dissanayake", "Pamindu Karunadasa", "Samadhi Gamagedara", "Sandun Wickramanayake"] },
  { team: "Segmentation_Fault", university: "(KDU) General Sir John K", members: ["Muditha Premachandra", "Sanjaya Perera", "Janudi Udugamasooriya", "Jalani Kadupitiya"] },
  { team: "zeus", university: "(KDU)", members: ["SYN Peiris", "PV Kavinda", "Harendra Thennkoon", "P Rohit"] }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Team.deleteMany({});
    await Member.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data.');

    // Insert new data
    for (const tData of teamsData) {
      const team = await Team.create({ name: tData.team, university: tData.university });
      for (const mName of tData.members) {
        await Member.create({ team_id: team._id, name: mName });
      }
    }

    console.log('Successfully seeded real team data with university names!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
