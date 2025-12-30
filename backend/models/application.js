const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resume: String,
  status: { type: String, enum: ['applied', 'approved', 'rejected', 'accepted', 'in-progress', 'completed'], default: 'applied' },
  projectSubmission: {
    file: String,
    fileName: String,
    fileSize: Number,
    description: String,
    submittedAt: Date,
    isSubmitted: { type: Boolean, default: false }
  },
  payment: {
    status: { 
      type: String, 
      enum: ['not_initiated', 'escrow_hold', 'pending_approval', 'approved', 'released', 'rejected'], 
      default: 'not_initiated' 
    },
    amount: { type: Number },
    escrowTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    releaseTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    approvedAt: { type: Date },
    rejectionReason: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
