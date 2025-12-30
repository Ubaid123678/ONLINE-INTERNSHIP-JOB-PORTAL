const User = require('../models/user');
const mongoose = require('mongoose');
const Rating = require('../models/rating');

/**
 * Level System Configuration
 * Points are earned through ratings: rating value * 20 points
 * Example: 5-star rating = 100 points, 1-star rating = 20 points
 */
const LEVEL_TIERS = [
  { level: 1, name: 'Bronze', minPoints: 0, maxPoints: 99, color: '#CD7F32' },
  { level: 2, name: 'Bronze', minPoints: 100, maxPoints: 249, color: '#CD7F32' },
  { level: 3, name: 'Silver', minPoints: 250, maxPoints: 499, color: '#C0C0C0' },
  { level: 4, name: 'Silver', minPoints: 500, maxPoints: 999, color: '#C0C0C0' },
  { level: 5, name: 'Gold', minPoints: 1000, maxPoints: 1999, color: '#FFD700' },
  { level: 6, name: 'Gold', minPoints: 2000, maxPoints: 3499, color: '#FFD700' },
  { level: 7, name: 'Platinum', minPoints: 3500, maxPoints: 5499, color: '#E5E4E2' },
  { level: 8, name: 'Platinum', minPoints: 5500, maxPoints: 7999, color: '#E5E4E2' },
  { level: 9, name: 'Diamond', minPoints: 8000, maxPoints: 11999, color: '#B9F2FF' },
  { level: 10, name: 'Diamond', minPoints: 12000, maxPoints: 17999, color: '#B9F2FF' },
  { level: 11, name: 'Master', minPoints: 18000, maxPoints: Infinity, color: '#FF1493' }
];

const BADGES = {
  FIRST_RATING: {
    name: 'First Impression',
    description: 'Received your first rating',
    icon: 'star',
    condition: (stats) => stats.totalRatings >= 1
  },
  FIVE_STAR_STREAK: {
    name: 'Perfect Performer',
    description: 'Received 5 consecutive 5-star ratings',
    icon: 'award',
    condition: (stats) => stats.fiveStarStreak >= 5
  },
  TEN_RATINGS: {
    name: 'Rising Star',
    description: 'Received 10 ratings',
    icon: 'trending-up',
    condition: (stats) => stats.totalRatings >= 10
  },
  FIFTY_RATINGS: {
    name: 'Veteran',
    description: 'Received 50 ratings',
    icon: 'shield',
    condition: (stats) => stats.totalRatings >= 50
  },
  HIGH_AVERAGE: {
    name: 'Excellence',
    description: 'Maintained 4.5+ average rating with 10+ ratings',
    icon: 'trophy',
    condition: (stats) => stats.averageRating >= 4.5 && stats.totalRatings >= 10
  },
  HUNDRED_RATINGS: {
    name: 'Legend',
    description: 'Received 100 ratings',
    icon: 'crown',
    condition: (stats) => stats.totalRatings >= 100
  }
};

class LevelService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Calculate level based on total points
   */
  calculateLevel(totalPoints) {
    const tier = LEVEL_TIERS.find(t => totalPoints >= t.minPoints && totalPoints <= t.maxPoints) || LEVEL_TIERS[0];
    const nextTier = LEVEL_TIERS.find(t => t.level === tier.level + 1);
    
    return {
      levelNumber: tier.level,
      levelName: tier.name,
      levelColor: tier.color,
      currentPoints: totalPoints,
      pointsInCurrentLevel: totalPoints - tier.minPoints,
      pointsToNextLevel: nextTier ? (nextTier.minPoints - totalPoints) : 0,
      nextLevelName: nextTier ? nextTier.name : tier.name,
      progress: nextTier ? ((totalPoints - tier.minPoints) / (nextTier.minPoints - tier.minPoints) * 100) : 100
    };
  }

  /**
   * Calculate points from a rating
   */
  calculatePointsFromRating(ratingValue) {
    // Each rating gives: rating * 20 points
    // 5 stars = 100 points, 4 stars = 80 points, etc.
    return ratingValue * 20;
  }

  /**
   * Get user statistics for badge evaluation
   */
  async getUserStats(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const allRatings = await Rating.find({ ratedUser: userId }).sort('-createdAt');
    
    // Calculate 5-star streak
    let fiveStarStreak = 0;
    let currentStreak = 0;
    for (const rating of allRatings) {
      if (rating.rating === 5) {
        currentStreak++;
        fiveStarStreak = Math.max(fiveStarStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      totalRatings: user.ratings.totalRatings,
      averageRating: user.ratings.averageRating,
      totalPoints: user.achievements.totalPoints,
      fiveStarStreak,
      currentBadges: user.achievements.badges || []
    };
  }

  /**
   * Check and award new badges
   */
  async checkAndAwardBadges(userId) {
    const stats = await this.getUserStats(userId);
    if (!stats) return [];

    const newBadges = [];
    const currentBadgeNames = stats.currentBadges.map(b => b.name);

    for (const [key, badge] of Object.entries(BADGES)) {
      if (!currentBadgeNames.includes(badge.name) && badge.condition(stats)) {
        newBadges.push({
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date()
        });
      }
    }

    return newBadges;
  }

  /**
   * Update user level and achievements after receiving a rating
   */
  async updateUserLevel(userId, newRatingValue) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate points from the new rating
      const pointsEarned = this.calculatePointsFromRating(newRatingValue);
      
      // Get current achievements or initialize
      const currentAchievements = user.achievements || {
        totalPoints: 0,
        levelNumber: 1,
        level: 'Bronze',
        badges: [],
        streak: { current: 0, longest: 0 }
      };

      // Add points
      const newTotalPoints = currentAchievements.totalPoints + pointsEarned;
      
      // Calculate new level
      const levelInfo = this.calculateLevel(newTotalPoints);
      
      // Check if level increased
      const leveledUp = levelInfo.levelNumber > (currentAchievements.levelNumber || 1);
      const previousLevel = currentAchievements.levelNumber || 1;
      const previousLevelName = currentAchievements.level || 'Bronze';

      // Update user achievements
      user.achievements = {
        ...currentAchievements,
        level: levelInfo.levelName,
        levelNumber: levelInfo.levelNumber,
        totalPoints: newTotalPoints,
        pointsToNextLevel: levelInfo.pointsToNextLevel
      };

      await user.save();

      // Check for new badges
      const newBadges = await this.checkAndAwardBadges(userId);
      
      if (newBadges.length > 0) {
        user.achievements.badges = [...(user.achievements.badges || []), ...newBadges];
        await user.save();
      }

      // Emit real-time updates
      if (this.io) {
        // Emit level update
        this.io.to(`user:${userId}`).emit('level-update', {
          ...levelInfo,
          pointsEarned,
          leveledUp,
          previousLevel,
          previousLevelName
        });

        // Emit badge awards
        if (newBadges.length > 0) {
          this.io.to(`user:${userId}`).emit('badges-earned', newBadges);
        }
      }

      return {
        levelInfo,
        pointsEarned,
        leveledUp,
        previousLevel,
        previousLevelName,
        newBadges
      };

    } catch (error) {
      console.error('Update user level error:', error);
      throw error;
    }
  }

  /**
   * Recalculate user level from all their ratings (for data migration/correction)
   */
  async recalculateUserLevel(userId) {
    try {
      const allRatings = await Rating.find({ ratedUser: userId });
      const totalPoints = allRatings.reduce((sum, rating) => {
        return sum + this.calculatePointsFromRating(rating.rating);
      }, 0);

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const levelInfo = this.calculateLevel(totalPoints);

      user.achievements = {
        ...(user.achievements || {}),
        level: levelInfo.levelName,
        levelNumber: levelInfo.levelNumber,
        totalPoints: totalPoints,
        pointsToNextLevel: levelInfo.pointsToNextLevel
      };

      await user.save();

      // Check and award badges
      const newBadges = await this.checkAndAwardBadges(userId);
      if (newBadges.length > 0) {
        user.achievements.badges = [...(user.achievements.badges || []), ...newBadges];
        await user.save();
      }

      return {
        levelInfo,
        totalPoints,
        badges: user.achievements.badges
      };

    } catch (error) {
      console.error('Recalculate user level error:', error);
      throw error;
    }
  }

  /**
   * Get level progress for display
   */
  async getLevelProgress(userId) {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
    const user = await User.findById(userId);
    if (!user) return null;

    const totalPoints = user.achievements?.totalPoints || 0;
    const levelInfo = this.calculateLevel(totalPoints);

    return {
      ...levelInfo,
      badges: user.achievements?.badges || [],
      streak: user.achievements?.streak || { current: 0, longest: 0 }
    };
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(role = null, limit = 10) {
    const query = role ? { role } : { role: { $in: ['student', 'client'] } };
    
    const users = await User.find(query)
      .select('name email role profile.profilePicture achievements ratings')
      .sort({ 'achievements.totalPoints': -1 })
      .limit(limit);

    return users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profile?.profilePicture,
      level: user.achievements?.level || 'Bronze',
      levelNumber: user.achievements?.levelNumber || 1,
      totalPoints: user.achievements?.totalPoints || 0,
      averageRating: user.ratings?.averageRating || 0,
      totalRatings: user.ratings?.totalRatings || 0,
      badges: (user.achievements?.badges || []).length
    }));
  }
}

module.exports = LevelService;
