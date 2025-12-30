const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/user');
const Admin = require('../models/admin');

const ADMIN_EMAIL = 'admin@portal.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Platform Administrator';

(async function createAdmin() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'online_internship_portal';

  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log('   If you forgot the password, delete this admin from MongoDB and run the script again.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    // Create admin record
    await Admin.create({
      user: adminUser._id,
      name: adminUser.name,
      email: adminUser.email
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🔐 You can now login at: http://localhost:3001/login');
    console.log('⚠️  Please change the password after first login!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
})();
