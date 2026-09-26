require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/competition';

// Schemas & Models
const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
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
  { team: "Bonty_Hunt3R", members: ["Kavishka Chathuranga", "Ishini Shanika", "Pasan Madushanka", "Chamindu Lakshan"] },
  { team: "sudOps", members: ["Kavindu Sanjitha", "Jayashan Nawarathna", "Piyumal Sandeepa", "Mahesh Umayanga"] },
  { team: "The_Anonymous", members: ["Sachintha Pallegedara", "Sanjula Thilakarathne", "Pramith Evans", "Malith Wijayathilake"] },
  { team: "0xOverflow", members: ["Muflih Ahmes Junaid", "Dusheepan Pirabaharan", "Sanjeew Shewon Sivakant", "Logachandran Hirukshan"] },
  { team: "Hack_to_the_Future", members: ["Hasitha Kodagoda", "Pomod Dissanayake", "Rishush Adithya", "Hasitha Yapa"] },
  { team: "GolD_Roger", members: ["Harsha Madhubashana", "GAVESH RANAWEERA", "DINETH THILANKA", "Himeth Iddamalgoda"] },
  { team: "Silent_Protocol", members: ["Rusiru Vinvidu", "Yasiru Nawodya", "Chamikara Herath", "Manura Yapa"] },
  { team: "Templars", members: ["Shaminda Hettiarachchi", "Wenura Mudalige", "Achintha Gamage", "Sandima Umayanjalee"] },
  { team: "TheByteForce", members: ["Nuwan Dhananjaya", "Savindu Dilshan", "Sahas Eashan", "Himeth Walgampaya"] },
  { team: "Team_PhaZto", members: ["Sithum Shihara", "Chanupa Chansidu", "Yasara Daneji", "Rasan Fernando"] },
  { team: "Cyber_Sparrows", members: ["Jathushihan K", "Aashik MSM", "Ahamed AJA", "Ahamed YS"] },
  { team: "404_D34D_DR0P", members: ["Sanidi Peiris", "Chamod Nisal", "Sanjitha Prabashwara"] },
  { team: "NXTRC", members: ["Inusha Thathsara Gunase", "Madhura Ravishan Abeywickr", "Janitha Jayasinghe", "Pabodha Samudini"] },
  { team: "CyBER_KNiGHtS", members: ["Uvin Nanayakkara", "Wishvajith Weerasingha", "Vinuka Oshadha", "Subodha Tharuka"] },
  { team: "cypher_ghost", members: ["Suresh Bhanuka", "Damindu Prasadith", "Prasindu Deshan", "Chamika Nimnajith"] },
  { team: "Cloud9", members: ["Kavishka Gayan", "Savithi Vinhara", "Sithum udara", "Movini Manavi"] },
  { team: "AGNI_404", members: ["Renue Branoz", "Madhusankha Nayanajith", "Adithya Srithika Sandiw", "Darshika Madhuhansani"] },
  { team: "Trojans_404", members: ["Hansana HAJ", "Ratnayake RMPM", "Ilmam IM", "Wanasinghe WMCOB"] },
  { team: "Vijaya", members: ["Manuthi Kasuntha", "Senanayake W S C M", "Silva TCK", "Rodrigo W A C C W"] },
  { team: "nova_nexus", members: ["Praveen Ethipola", "Supasan Geeganage", "Chethiya Kaushal", "Nimmitha Idirimana"] },
  { team: "403_privileged", members: ["RUSIRU SADATHANA", "JAINDU CHARINDITH", "SASITH INDUWARA", "DANANJAYA KUMARA"] },
  { team: "bytex_zero", members: ["Kavindu Premathilake", "Kalindu Jayathilaka", "Kasuntha Chackranga", "Nudeera Randuni"] },
  { team: "Team_Y2K", members: ["Teshan", "Thilakshan", "Saheththiyan"] },
  { team: "LO49", members: ["Achin Chandrasiri", "Risadi Weerasinghe", "Pasidu Rajapaksha"] },
  { team: "Flag_Not_Found", members: ["Sachintha Shehara", "Upeksha Wijerathne", "Nisuli Weerasinghe", "Malshi Weerasinghe"] },
  { team: "CipherStorm", members: ["Vidusini Abesekara", "Nirod Nikeshala", "Hasala Kavinda"] },
  { team: "Cipher_Storm", members: ["Chathura Madushan", "Yashodha", "Oshan", "Sahan"] },
  { team: "Prevail_Stars", members: ["NM Roshaan Akther", "MNM Zaatheer", "MA Ammaar"] },
  { team: "deadlock", members: ["Wijayapala HMHL", "Nimalaweera NGCM", "JP Gamlath", "Bandara KMSN"] },
  { team: "raven", members: ["Benuka Mudalige", "Dilmi Prasadhi", "Nipuni liyange", "Sandaru Dilshan"] },
  { team: "Atronox", members: ["Kavindu Sahan Silva", "Heshan Thenura Kariyawasam", "Janith Deshan Mihijaya Sa"] },
  { team: "Malware_Mafia", members: ["Rishitha Dilshan", "Tharun Hansitha", "Teshan Chamuditha"] },
  { team: "Cipher_Nexus", members: ["Senuk Yuthmika", "Dinithi Dilhara Withanapathira", "Suwanika", "Kamith Samaraweera"] },
  { team: "Root_Access", members: ["Koshihan", "Theshathree", "Rathnayaka", "Silva"] },
  { team: "Byte_Breach", members: ["Okith Moksha", "Muhammadh Hameez", "Muqshith Akbar", "Keshan Rathnayake"] },
  { team: "Dimension_C137", members: ["Yasith Buddhima", "Samuditha Asansa", "Rusiru Sulochana", "Duleepa Madushan"] },
  { team: "SabraX", members: ["KTDDM Jayathissa", "KH Madushnaka", "DCA Perera", "DMAKA Dissanayaka"] },
  { team: "QuantumX", members: ["Kasun Dissanayake", "Pamindu Karunadasa", "Samadhi Gamagedara", "Sandun Wickramanayake"] },
  { team: "Segmentation_Fault", members: ["Muditha Premachandra", "Sanjaya Perera", "Janudi Udugamasooriya", "Jalani Kadupitiya"] },
  { team: "zeus", members: ["SYN Peiris", "PV Kavinda", "Harendra Thennkoon", "P Rohit"] }
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
      const team = await Team.create({ name: tData.team });
      for (const mName of tData.members) {
        await Member.create({ team_id: team._id, name: mName });
      }
    }

    console.log('Successfully seeded real team data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
