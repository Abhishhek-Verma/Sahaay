require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin user model with password
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'abhishek_verma' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      process.exit(0);
    }

    // Hash the password
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await Admin.create({
      username: 'abhishek_verma',
      email: process.env.ADMIN_EMAIL || 'admin@sahaay.com',
      password: hashedPassword,
      name: 'Abhishek Verma',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
