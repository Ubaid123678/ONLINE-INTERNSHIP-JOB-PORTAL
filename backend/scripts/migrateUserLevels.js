/**
 * Migration script to initialize achievement levels for existing users
 * Run this once to calculate initial levels based on existing ratings
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Rating = require('../models/rating');

const LEVEL_TIERS = [
  { level: 1, name: 'Bronze', minPoints: 0, maxPoints: 99 },
  { level: 2, name: 'Bronze', minPoints: 100, maxPoints: 249 },
  { level: 3, name: 'Silver', minPoints: 250, maxPoints: 499 },
  { level: 4, name: 'Silver', minPoints: 500, maxPoints: 999 },
  { level: 5, name: 'Gold', minPoints: 1000, maxPoints: 1999 },
  { level: 6, name: 'Gold', minPoints: 2000, maxPoints: 3499 },
  { level: 7, name: 'Platinum', minPoints: 3500, maxPoints: 5499 },
  { level: 8, name: 'Platinum', minPoints: 5500, maxPoints: 7999 },
  { level: 9, name: 'Diamond', minPoints: 8000, maxPoints: 11999 },
  { level: 10, name: 'Diamond', minPoints: 12000, maxPoints: 17999 },
  { level: 11, name: 'Master', minPoints: 18000, maxPoints: Infinity }
];

const calculateLevel = (totalPoints) => {
  const tier = LEVEL_TIERS.find(t => totalPoints >= t.minPoints && totalPoints <= t.maxPoints) || LEVEL_TIERS[0];
  const nextTier = LEVEL_TIERS.find(t => t.level === tier.level + 1);
  
  return {
    levelNumber: tier.level,
    levelName: tier.name,
    pointsToNextLevel: nextTier ? (nextTier.minPoints - totalPoints) : 0
  };
};

const calculatePointsFromRating = (ratingValue) => {
  return ratingValue * 20;
};

async function migrateUserLevels() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online_internship_portal');
    console.log('✅ Connected to MongoDB');

    const users = await User.find({ role: { $in: ['student', 'client'] } });
    console.log(`📊 Found ${users.length} users to process\n`);

    let processed = 0;
    let updated = 0;

    for (const user of users) {
      try {
        // Get all ratings for this user
        const ratings = await Rating.find({ ratedUser: user._id });
        
        // Calculate total points
        const totalPoints = ratings.reduce((sum, rating) => {
          return sum + calculatePointsFromRating(rating.rating);
        }, 0);

        // Calculate level
        const levelInfo = calculateLevel(totalPoints);

        // Update user
        user.achievements = {
          level: levelInfo.levelName,
          levelNumber: levelInfo.levelNumber,
          totalPoints: totalPoints,
          pointsToNextLevel: levelInfo.pointsToNextLevel,
          badges: [],
          streak: {
            current: 0,
            longest: 0
          }
        };

        await user.save();

        console.log(`✓ ${user.name} (${user.role}): ${totalPoints} points → ${levelInfo.levelName} Level ${levelInfo.levelNumber}`);
        updated++;

      } catch (error) {
        console.error(`✗ Error processing user ${user.name}:`, error.message);
      }

      processed++;
    }

    console.log(`\n📈 Migration Complete:`);
    console.log(`   - Processed: ${processed} users`);
    console.log(`   - Updated: ${updated} users`);
    console.log(`   - Failed: ${processed - updated} users`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run migration
migrateUserLevels();
