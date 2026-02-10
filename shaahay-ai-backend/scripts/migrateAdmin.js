require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

async function migrateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin from Admin collection
    const admin = await Admin.findOne({ username: 'abhishek_verma' });
    
    if (!admin) {
      console.log('❌ Admin not found in Admin collection');
      process.exit(1);
    }

    // Check if already migrated
    const existingUser = await User.findOne({ username: admin.username });
    if (existingUser) {
      console.log('⚠️  Admin already migrated to User collection');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      process.exit(0);
    }

    // Create admin in User collection
    await User.create({
      username: admin.username,
      email: admin.email,
      password: admin.password, // Already hashed
      name: admin.name,
      role: 'admin',
      phone: admin.phone || '',
      isActive: true,
    });

    console.log('✅ Admin migrated successfully to User collection');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating admin:', error);
    process.exit(1);
  }
}

migrateAdmin();
