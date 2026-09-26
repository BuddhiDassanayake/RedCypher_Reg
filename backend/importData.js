require('dotenv').config();
const mongoose = require('mongoose');

// ==========================================
// LIST OF ALL 40 TEAMS FROM YOUR PDF
// ==========================================
const teamNames = [
  "Team_PhaZto", "404_D34D_DROP", "403_privileged", "Bonty_Hunt3R", 
  "AGNI_404", "Team_Y2K", "TheByteForce", "NXTRC", 
  "Segmentation_Fault", "GolD_Roger", "Prevail_Stars", "QuantumX", 
  "nova_nexus", "Malware_Mafia", "CyBER_KNiGHtS", "0xOverflow", 
  "Templars", "Trojans_404", "Vijaya", "zeus", 
  "CipherStorm", "raven", "Cipher_Storm", "Byte_Breach", 
  "Flag_Not_Found", "Dimension_C137", "Hack_to_the_Future", "LO49", 
  "Cloud9", "Silent_Protocol", "deadlock", "Atronox", 
  "Cyber_Sparrows", "Root_Access", "sudOps", "bytex_zero", 
  "SabraX", "The_Anonymous", "Cipher_Nexus", "cypher_ghost"
];
// ==========================================


// Database Schemas
const MONGO_URI = process.env.MONGO_URI;
const teamSchema = new mongoose.Schema({ name: String });
const memberSchema = new mongoose.Schema({ team_id: mongoose.Schema.Types.ObjectId, name: String });

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

async function importData() {
  if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing in your .env file!");
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    console.log('🧹 Clearing old mock data...');
    await Team.deleteMany({});
    await Member.deleteMany({});
    
    console.log(`🚀 Inserting ${teamNames.length} teams from the PDF...`);
    for (const tName of teamNames) {
      const team = await Team.create({ name: tName });
      
      // Creating 4 placeholder members for each team
      const memberPromises = [1, 2, 3, 4].map(num => 
        Member.create({ team_id: team._id, name: `Member ${num}` })
      );
      
      await Promise.all(memberPromises);
      console.log(`  -> Added team: ${tName} (4 members)`);
    }

    console.log('\n🎉 ALL DONE! Your 40 teams have been imported into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();
