require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/job');
const connectDB = require('../config/db');

const fixJobRecruiter = async () => {
  try {
    await connectDB();
    
    // Find all jobs without recruiter field
    const jobsWithoutRecruiter = await Job.find({ recruiter: { $exists: false } });
    
    console.log(`Found ${jobsWithoutRecruiter.length} jobs without recruiter field`);
    
    if (jobsWithoutRecruiter.length === 0) {
      console.log('All jobs have recruiter field. No changes needed.');
      process.exit(0);
    }
    
    // For each job, we need to find who posted it
    // Since we don't have this info, we'll need to get the first client user
    const User = require('../models/user');
    const clientUser = await User.findOne({ role: 'client' });
    
    if (!clientUser) {
      console.log('No client user found. Please create a client user first.');
      process.exit(1);
    }
    
    console.log(`Will assign jobs to client user: ${clientUser.name} (${clientUser.email})`);
    
    // Update all jobs without recruiter
    const result = await Job.updateMany(
      { recruiter: { $exists: false } },
      { $set: { recruiter: clientUser._id } }
    );
    
    console.log(`Updated ${result.modifiedCount} jobs`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixJobRecruiter();
