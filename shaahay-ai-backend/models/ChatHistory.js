const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  botReply: {
    type: String,
    required: true,
  },
  detectedState: String,
  confidence: Number,
  sentiment: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'crisis'],
    default: 'low',
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  counselorNotified: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
