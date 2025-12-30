const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');
const User = require('../models/user');
const Application = require('../models/application');
const auth = require('../middleware/auth');

// This will be initialized in server.js with Socket.IO instance
let levelService = null;
let notificationService = null;

// Initialize services
router.setServices = (services) => {
  levelService = services.levelService;
  notificationService = services.notificationService;
};

router.post('/', auth, async (req, res) => {
  try {
    const { ratedUserId, rating, review, relatedJob, relatedApplication } = req.body;

    if (!ratedUserId || !rating) {
      return res.status(400).json({ message: 'Rated user and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (req.user.id === ratedUserId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }

    // Get the current user's role
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const ratedUser = await User.findById(ratedUserId);
    if (!ratedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.role === ratedUser.role) {
      return res.status(400).json({ message: 'You can only rate users of different role (students rate clients, clients rate students)' });
    }

    let existingRating = await Rating.findOne({
      ratedUser: ratedUserId,
      ratedBy: req.user.id
    });

    let isNewRating = !existingRating;

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      if (relatedJob) existingRating.relatedJob = relatedJob;
      if (relatedApplication) existingRating.relatedApplication = relatedApplication;
      await existingRating.save();
    } else {
      existingRating = new Rating({
        ratedUser: ratedUserId,
        ratedBy: req.user.id,
        rating,
        review,
        relatedJob,
        relatedApplication
      });
      await existingRating.save();
    }

    // Recalculate ratings
    const allRatings = await Rating.find({ ratedUser: ratedUserId });
    const totalRatings = allRatings.length;
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    ratedUser.ratings = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings
    };
    await ratedUser.save();

    // Update level and achievements (real-time)
    let levelUpdate = null;
    if (levelService && isNewRating) {
      try {
        levelUpdate = await levelService.updateUserLevel(ratedUserId, rating);
        
        // Send notification if user leveled up
        if (levelUpdate.leveledUp && notificationService) {
          await notificationService.createNotification({
            recipient: ratedUserId,
            sender: req.user.id,
            type: 'level_up',
            title: '🎉 Level Up!',
            message: `Congratulations! You've reached ${levelUpdate.levelInfo.levelName} Level ${levelUpdate.levelInfo.levelNumber}!`,
            link: '/profile'
          });
        }

        // Send notification for new badges
        if (levelUpdate.newBadges && levelUpdate.newBadges.length > 0 && notificationService) {
          for (const badge of levelUpdate.newBadges) {
            await notificationService.createNotification({
              recipient: ratedUserId,
              sender: req.user.id,
              type: 'badge_earned',
              title: '🏆 New Badge Earned!',
              message: `You've earned the "${badge.name}" badge: ${badge.description}`,
              link: '/profile'
            });
          }
        }
      } catch (error) {
        console.error('Level update error:', error);
        // Continue even if level update fails
      }
    }

    const populatedRating = await Rating.findById(existingRating._id)
      .populate('ratedUser', 'name email role profile.profilePicture achievements')
      .populate('ratedBy', 'name email role profile.profilePicture');

    res.json({
      message: 'Rating submitted successfully',
      rating: populatedRating,
      updatedStats: ratedUser.ratings,
      levelUpdate: levelUpdate
    });

  } catch (error) {
    console.error('Rating creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('ratedBy', 'name email role profile.profilePicture profile.company')
      .populate('relatedJob', 'title company')
      .sort('-createdAt');

    const user = await User.findById(req.params.userId).select('ratings');

    res.json({
      ratings,
      stats: user ? user.ratings : { averageRating: 0, totalRatings: 0 }
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/given', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedBy: req.user.id })
      .populate('ratedUser', 'name email role profile.profilePicture')
      .populate('relatedJob', 'title company')
      .sort('-createdAt');

    res.json({ ratings });
  } catch (error) {
    console.error('Get given ratings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/check/:userId', auth, async (req, res) => {
  try {
    const existingRating = await Rating.findOne({
      ratedUser: req.params.userId,
      ratedBy: req.user.id
    });

    res.json({
      hasRated: !!existingRating,
      rating: existingRating || null
    });
  } catch (error) {
    console.error('Check rating error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:ratingId', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.ratedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    const ratedUserId = rating.ratedUser;
    await rating.deleteOne();

    const allRatings = await Rating.find({ ratedUser: ratedUserId });
    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    await User.findByIdAndUpdate(ratedUserId, {
      ratings: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings
      }
    });

    // Recalculate level after rating deletion
    if (levelService) {
      try {
        await levelService.recalculateUserLevel(ratedUserId);
      } catch (error) {
        console.error('Level recalculation error:', error);
      }
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get level progress for a user
router.get('/level/:userId', async (req, res) => {
  try {
    if (!levelService) {
      return res.status(503).json({ message: 'Level service not available' });
    }

    const progress = await levelService.getLevelProgress(req.params.userId);
    
    if (!progress) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get level progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    if (!levelService) {
      return res.status(503).json({ message: 'Level service not available' });
    }

    const { role, limit } = req.query;
    const leaderboard = await levelService.getLeaderboard(
      role, 
      limit ? parseInt(limit) : 10
    );

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Recalculate user level (admin/maintenance)
router.post('/recalculate/:userId', auth, async (req, res) => {
  try {
    if (!levelService) {
      return res.status(503).json({ message: 'Level service not available' });
    }

    const result = await levelService.recalculateUserLevel(req.params.userId);
    res.json({
      message: 'Level recalculated successfully',
      ...result
    });
  } catch (error) {
    console.error('Recalculate level error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
