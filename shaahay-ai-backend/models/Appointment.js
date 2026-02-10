const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true,
  },
  counselorId: {
    type: String,
    required: true,
    index: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    default: 60, // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  type: {
    type: String,
    enum: ['individual', 'group', 'crisis', 'follow-up'],
    default: 'individual',
  },
  notes: String,
  reason: String,
  cancelReason: String,
  rating: Number,
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
