const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing without MongoDB. Please add your MONGODB_URI to .env file');
    // Don't exit process - allow app to run without MongoDB
  }
};

module.exports = connectDB;
