# Level & Achievement System Documentation

## Overview
The platform features a comprehensive gamification system that rewards users (both students and clients) based on their ratings and performance.

## Level System

### How Points are Earned
- Points are earned through ratings received from other users
- **Formula**: `Rating Value × 20 = Points Earned`
- Examples:
  - ⭐⭐⭐⭐⭐ (5 stars) = 100 points
  - ⭐⭐⭐⭐ (4 stars) = 80 points
  - ⭐⭐⭐ (3 stars) = 60 points
  - ⭐⭐ (2 stars) = 40 points
  - ⭐ (1 star) = 20 points

### Level Tiers

| Level | Tier Name | Points Range | Color |
|-------|-----------|--------------|-------|
| 1 | Bronze | 0 - 99 | #CD7F32 |
| 2 | Bronze | 100 - 249 | #CD7F32 |
| 3 | Silver | 250 - 499 | #C0C0C0 |
| 4 | Silver | 500 - 999 | #C0C0C0 |
| 5 | Gold | 1,000 - 1,999 | #FFD700 |
| 6 | Gold | 2,000 - 3,499 | #FFD700 |
| 7 | Platinum | 3,500 - 5,499 | #E5E4E2 |
| 8 | Platinum | 5,500 - 7,999 | #E5E4E2 |
| 9 | Diamond | 8,000 - 11,999 | #B9F2FF |
| 10 | Diamond | 12,000 - 17,999 | #B9F2FF |
| 11 | Master | 18,000+ | #FF1493 |

## Badge System

### Available Badges

1. **🌟 First Impression**
   - Description: Received your first rating
   - Condition: 1+ total ratings

2. **🏆 Perfect Performer**
   - Description: Received 5 consecutive 5-star ratings
   - Condition: 5-star streak ≥ 5

3. **📈 Rising Star**
   - Description: Received 10 ratings
   - Condition: 10+ total ratings

4. **🛡️ Veteran**
   - Description: Received 50 ratings
   - Condition: 50+ total ratings

5. **🥇 Excellence**
   - Description: Maintained 4.5+ average rating with 10+ ratings
   - Condition: Average ≥ 4.5 AND total ratings ≥ 10

6. **👑 Legend**
   - Description: Received 100 ratings
   - Condition: 100+ total ratings

## Real-Time Features

### Level Updates
- ⚡ Instant level calculation when receiving new ratings
- 📊 Real-time progress bar updates
- 🔔 Notifications for level-ups
- 📢 Badge unlock notifications

### WebSocket Events

#### `level-update`
Emitted when user's level changes
```javascript
{
  levelName: 'Gold',
  levelNumber: 5,
  currentPoints: 1250,
  pointsToNextLevel: 750,
  progress: 62.5,
  pointsEarned: 100,
  leveledUp: true,
  previousLevel: 4,
  previousLevelName: 'Silver'
}
```

#### `badges-earned`
Emitted when new badges are unlocked
```javascript
[
  {
    name: 'Rising Star',
    description: 'Received 10 ratings',
    icon: 'trending-up',
    earnedAt: '2025-12-17T10:30:00.000Z'
  }
]
```

## API Endpoints

### Get Level Progress
```
GET /api/ratings/level/:userId
```

**Response:**
```json
{
  "levelNumber": 5,
  "levelName": "Gold",
  "levelColor": "#FFD700",
  "currentPoints": 1250,
  "pointsInCurrentLevel": 250,
  "pointsToNextLevel": 750,
  "nextLevelName": "Gold",
  "progress": 62.5,
  "badges": [
    {
      "name": "First Impression",
      "description": "Received your first rating",
      "icon": "star",
      "earnedAt": "2025-12-17T10:00:00.000Z"
    }
  ],
  "streak": {
    "current": 3,
    "longest": 5
  }
}
```

### Get Leaderboard
```
GET /api/ratings/leaderboard?role={student|client}&limit=10
```

**Parameters:**
- `role` (optional): Filter by user role (student or client)
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "leaderboard": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "profilePicture": "uploads/profile.jpg",
      "level": "Gold",
      "levelNumber": 5,
      "totalPoints": 1250,
      "averageRating": 4.8,
      "totalRatings": 15,
      "badges": 3
    }
  ]
}
```

### Recalculate User Level
```
POST /api/ratings/recalculate/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Level recalculated successfully",
  "levelInfo": {
    "levelNumber": 5,
    "levelName": "Gold",
    "currentPoints": 1250
  },
  "totalPoints": 1250,
  "badges": []
}
```

## React Components

### LevelBadge
Display user's current level badge

```jsx
import LevelBadge from '../components/LevelBadge';

<LevelBadge 
  level="Gold"
  levelNumber={5}
  size="medium"  // small, medium, large
  showProgress={true}
  progress={62.5}
/>
```

### AchievementsCard
Display comprehensive achievement information

```jsx
import AchievementsCard from '../components/AchievementsCard';

<AchievementsCard 
  userId={user._id}
  showFullDetails={true}
/>
```

### Leaderboard
Display top performers

```jsx
import Leaderboard from '../components/Leaderboard';

<Leaderboard 
  role="student"  // student, client, or null for all
  limit={10}
/>
```

## Implementation Guide

### 1. Initial Migration
Run the migration script to calculate initial levels for existing users:

```bash
cd backend
node scripts/migrateUserLevels.js
```

### 2. Frontend Integration
Add components to dashboards:

```jsx
// StudentDashboard.js or ClientDashboard.js
import AchievementsCard from '../components/AchievementsCard';

// In stats section
<AchievementsCard userId={user?._id} showFullDetails={false} />
```

### 3. WebSocket Listeners
Listen for real-time updates:

```javascript
// In useEffect
socket.on('level-update', (data) => {
  if (data.leveledUp) {
    showNotification(`🎉 Level Up! You're now ${data.levelName} Level ${data.levelNumber}!`);
  }
});

socket.on('badges-earned', (badges) => {
  badges.forEach(badge => {
    showNotification(`🏆 New Badge: ${badge.name}`);
  });
});
```

## Database Schema

### User Model Addition
```javascript
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
    earnedAt: Date,
    icon: String
  }],
  streak: {
    current: Number,
    longest: Number,
    lastActivityDate: Date
  }
}
```

## Best Practices

1. **Real-Time Updates**: Always use WebSocket for instant level updates
2. **Caching**: Cache level calculations on frontend to reduce API calls
3. **Notifications**: Show celebratory UI when users level up or earn badges
4. **Leaderboards**: Update leaderboards periodically (every 5-10 minutes)
5. **Migration**: Run migration script after deploying to populate initial levels

## Performance Considerations

- Level calculations are performed asynchronously after rating submission
- Failed level updates don't block rating submission
- Leaderboard queries are indexed on `achievements.totalPoints`
- Badge checking is done efficiently with a single database query

## Future Enhancements

- Monthly/Weekly challenges
- Seasonal events with special badges
- Team-based achievements
- Streak bonuses for consecutive positive ratings
- Premium badges for top performers
- Achievement sharing on social media
