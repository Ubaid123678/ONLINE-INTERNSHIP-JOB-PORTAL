const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  skills: [String],
  location: String,
  budget: String,
  paymentType: {
    type: String,
    enum: ['hourly', 'project'],
    default: 'project'
  },
  paymentAmount: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
  status: { 
    type: String, 
    enum: ['active', 'processing', 'completed', 'closed'],
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
