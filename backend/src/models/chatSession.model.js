const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true 
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'New Chat Session'
  }
}, {
  timestamps: true 
});

ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

const chatSessionModel = mongoose.model('ChatSession', ChatSessionSchema);

module.exports = chatSessionModel;