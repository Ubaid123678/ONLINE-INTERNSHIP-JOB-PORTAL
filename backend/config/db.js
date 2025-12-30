const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || 'online_internship_portal',
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
});

module.exports = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI env variable is missing. Update .env with your MongoDB Compass connection string.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, getMongoOptions());
    console.log(`MongoDB connected to ${process.env.MONGO_DB_NAME || 'online_internship_portal'}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
