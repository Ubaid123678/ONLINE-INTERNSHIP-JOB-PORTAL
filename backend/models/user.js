const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true
  },
  role: { 
    type: String, 
    enum: ['student', 'client', 'admin'], 
    default: 'student',
    required: true
  },
  profile: {
    skills: [String],
    resume: String,
    profilePicture: String,
    bio: String,
    phone: String,
    location: String,
    company: String,
    website: String
  },
  ratings: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  achievements: {
    level: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'],
      default: 'Bronze'
    },
    levelNumber: {
      type: Number,
      default: 1,
      min: 1
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    pointsToNextLevel: {
      type: Number,
      default: 100
    },
    badges: [{
      name: String,
      description: String,
      earnedAt: {
        type: Date,
        default: Date.now
      },
      icon: String
    }],
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivityDate: Date
    }
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
