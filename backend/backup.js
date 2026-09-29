const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function backup() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');
    
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Create a backup folder on the Desktop
    const backupDir = path.join(require('os').homedir(), 'Desktop', 'Red_Cypher_Backup');
    if (!fs.existsSync(backupDir)){
        fs.mkdirSync(backupDir);
    }

    console.log(`Saving backup to: ${backupDir}`);

    // Loop through each collection and save its data to a JSON file
    for (let collection of collections) {
      const name = collection.name;
      const data = await mongoose.connection.db.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(backupDir, `${name}.json`), JSON.stringify(data, null, 2));
      console.log(` - Backed up collection: ${name} (${data.length} documents)`);
    }

    console.log('Backup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Backup failed:', err);
    process.exit(1);
  }
}

backup();
