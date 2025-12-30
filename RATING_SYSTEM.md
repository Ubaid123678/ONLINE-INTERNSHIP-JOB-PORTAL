# Rating System Implementation

## Overview
A comprehensive rating system that allows clients to rate students and students to rate clients, enhancing profile credibility and user experience.

## Features

### 1. **Two-Way Rating System**
- **Clients can rate Students** after working together
- **Students can rate Clients** based on their experience
- Each user can only rate another user once (can update existing rating)
- Users cannot rate themselves
- Users can only rate users of opposite role type

### 2. **Rating Components**

#### Rating Scale
- 1 to 5 stars rating system
- Visual star display with hover effects
- Average rating calculation with 1 decimal precision

#### Review System
- Optional text review (max 500 characters)
- Reviews are displayed publicly on profiles
- Character counter for review input

### 3. **Profile Integration**

#### User Profile Ratings Display
- Average rating score (large display)
- Total number of ratings
- Star distribution chart (5-star breakdown)
- Individual reviews with:
  - Reviewer name and profile picture
  - Star rating
  - Review text
  - Date posted
  - Related job (if applicable)

#### Rating Stats in User Model
```javascript
ratings: {
  averageRating: Number (0-5),
  totalRatings: Number
}
```

### 4. **API Endpoints**

#### POST `/api/ratings`
Submit or update a rating
```json
{
  "ratedUserId": "user_id",
  "rating": 4,
  "review": "Great experience!",
  "relatedJob": "job_id (optional)",
  "relatedApplication": "application_id (optional)"
}
```

#### GET `/api/ratings/user/:userId`
Get all ratings for a specific user
```json
{
  "ratings": [...],
  "stats": {
    "averageRating": 4.5,
    "totalRatings": 10
  }
}
```

#### GET `/api/ratings/given`
Get all ratings given by the authenticated user

#### GET `/api/ratings/check/:userId`
Check if authenticated user has already rated a specific user

#### DELETE `/api/ratings/:ratingId`
Delete own rating

### 5. **Security & Validation**

- Authentication required for all rating operations
- Users can only rate users of different roles
- Rating must be between 1-5
- Cannot rate yourself
- Reviews are limited to 500 characters
- Unique constraint: one rating per user pair

### 6. **UI Components**

#### RatingModal Component
- Interactive star selection
- Review text area
- Character counter
- Form validation
- Loading states

#### RatingDisplay Component
- Overall rating summary
- Star distribution visualization
- Reviews list with pagination
- Empty state when no ratings exist
- Responsive design

### 7. **Where Ratings Appear**

1. **Profile Page** (Own profile)
   - View your ratings from others
   - See breakdown of ratings received

2. **Public Profile Page** (Other users)
   - View user's rating stats
   - Read reviews from other users
   - Rate button (if eligible to rate)

3. **User Cards** (Future enhancement)
   - Display average rating on job applicant cards
   - Show rating on job poster profiles

## Usage Flow

### For Clients Rating Students:
1. Client works with a student on a project/job
2. Client visits student's public profile
3. Clicks "Rate User" button
4. Selects star rating (1-5)
5. Optionally writes a review
6. Submits rating
7. Student's profile updates with new average

### For Students Rating Clients:
1. Student completes work for a client
2. Student visits client's public profile
3. Clicks "Rate User" button
4. Selects star rating (1-5)
5. Optionally writes a review about work experience
6. Submits rating
7. Client's profile updates with new average

## Benefits

### For Users (Students)
- Build credibility through positive ratings
- Showcase work quality to potential clients
- Stand out with high ratings
- Receive constructive feedback

### For Clients (Recruiters)
- Build trust with potential candidates
- Demonstrate good employer practices
- Attract better talent with high ratings
- Get feedback on hiring process

### For Platform
- Enhanced user engagement
- Quality assurance mechanism
- Trust building between users
- Profile enhancement feature
- Data for recommending top-rated users

## Database Schema

### Rating Model
```javascript
{
  ratedUser: ObjectId (ref: User),
  ratedBy: ObjectId (ref: User),
  rating: Number (1-5),
  review: String (max 500),
  relatedJob: ObjectId (ref: Job, optional),
  relatedApplication: ObjectId (ref: Application, optional),
  createdAt: Date,
  updatedAt: Date
}
```

### User Model Updates
```javascript
{
  // ... existing fields
  ratings: {
    averageRating: Number (0-5, default: 0),
    totalRatings: Number (default: 0)
  }
}
```

## Implementation Files

### Backend
- `/backend/models/rating.js` - Rating model schema
- `/backend/routes/ratings.js` - Rating API routes
- `/backend/models/user.js` - Updated with rating fields
- `/backend/server.js` - Rating routes registered

### Frontend
- `/frontend/src/components/RatingModal.js` - Rating input component
- `/frontend/src/components/RatingDisplay.js` - Rating display component
- `/frontend/src/pages/ProfilePage.js` - Updated with ratings section
- `/frontend/src/pages/PublicProfilePage.js` - Updated with rating feature

## Future Enhancements

1. **Rating Filters**
   - Filter by rating score
   - Sort users by highest rated

2. **Rating Analytics**
   - Rating trends over time
   - Most helpful reviews
   - Response from rated users

3. **Email Notifications**
   - Notify when someone rates you
   - Prompt to rate after job completion

4. **Rating Badges**
   - "Top Rated" badge for 4.5+ average
   - "Verified Reviewer" badge
   - "Rising Star" for new highly-rated users

5. **Admin Features**
   - Review moderation
   - Flag inappropriate reviews
   - Rating dispute resolution
