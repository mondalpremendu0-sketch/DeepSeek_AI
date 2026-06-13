const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true,
    index: true 
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reasoningContent: {
    type: String,
    default: ''
  },
  thinkingTime: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    index: true 
  }
}, {
  timestamps: true
});

MessageSchema.index({ sessionId: 1, createdAt: 1 });

const messageModel = mongoose.model('Message', MessageSchema);


module.exports = messageModel;