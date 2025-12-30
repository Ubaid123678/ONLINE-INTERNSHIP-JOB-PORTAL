const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

mongoose.set('strictQuery', true);

const REQUIRED_COLLECTIONS = ['users', 'jobs', 'applications'];

(async function initDatabase() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'online_internship_portal';

  if (!uri) {
    console.error('Set MONGO_URI with your MongoDB Compass connection string before running init:db');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
    const existing = (await mongoose.connection.db.listCollections().toArray()).map((c) => c.name);

    for (const name of REQUIRED_COLLECTIONS) {
      if (existing.includes(name)) {
        console.log(`Collection already exists: ${name}`);
        continue;
      }

      await mongoose.connection.db.createCollection(name);
      console.log(`Created collection: ${name}`);
    }

    console.log(`MongoDB Compass database "${dbName}" is ready.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('init:db failed:', err.message);
    process.exit(1);
  }
})();
