const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    enum: ['student', 'counselor', 'admin'],
    required: true,
  },
  // Student specific fields
  department: String,
  year: Number,
  
  // Counselor specific fields
  specialization: [String],
  availableHours: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  qualification: String,
  experience: Number,
  bio: String,
  degree: String,
  profileImage: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  officeHours: String,
  title: String,
  
  // Common fields
  phone: String,
  avatar: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('User', userSchema);
