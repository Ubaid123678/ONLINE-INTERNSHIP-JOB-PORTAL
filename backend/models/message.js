const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  application: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application',
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    trim: true 
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, { timestamps: true });

// Index for faster queries
MessageSchema.index({ application: 1, createdAt: 1 });
MessageSchema.index({ receiver: 1, read: 1 });
MessageSchema.index({ receiver: 1, status: 1 });

module.exports = mongoose.model('Message', MessageSchema);
