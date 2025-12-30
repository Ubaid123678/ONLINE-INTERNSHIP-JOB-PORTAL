# Message Notifications Implementation

## Overview
Complete messaging notification system has been implemented with unread message counts on chat buttons and notifications in the header.

## Features Implemented

### 1. **Message Notifications in Header**
- When a client or student sends a message, the recipient receives a notification in the notification bell
- Shows: "New Message - [Sender Name] sent you a message about [Job Title]"
- Clicking the notification navigates to the job applications page
- Real-time delivery via Socket.IO

### 2. **Unread Message Count Badges on Chat Buttons**
- Red badge appears on "Continue Chat" / "Start Chat" buttons
- Shows number of unread messages (displays "99+" if more than 99)
- Updates in real-time when new messages arrive
- Badge disappears when messages are read in the chat

### 3. **Real-time Updates**
- Uses Socket.IO for instant notification delivery
- Unread counts update immediately when messages are sent/received
- No page refresh needed

## Technical Implementation

### Backend Changes

#### 1. Updated Notification Service
**File:** `backend/services/notificationService.js`
- Added `notifyNewMessage()` method
- Creates notification for message recipient
- Emits via Socket.IO to user-specific room

#### 2. Updated Socket Service
**File:** `backend/services/socketService.js`
- Integrated notification service
- Creates message notification when message is sent
- Sends to recipient's user room

#### 3. New Message Route
**File:** `backend/routes/messages.js`
- Added `/messages/unread-by-application` endpoint
- Returns unread message count per application for current user
- Uses MongoDB aggregation for efficiency

```javascript
GET /api/messages/unread-by-application
Response: {
  unreadCounts: {
    "applicationId1": 5,
    "applicationId2": 2
  }
}
```

### Frontend Changes

#### 1. JobApplicationsPage Updates
**File:** `frontend/src/pages/JobApplicationsPage.js`
- Added `unreadCounts` state
- Added `fetchUnreadCounts()` function
- Socket.IO listener for real-time updates
- Badge on chat button showing unread count

#### 2. StudentDashboard Updates
**File:** `frontend/src/pages/StudentDashboard.js`
- Same implementation as JobApplicationsPage
- Real-time unread count updates
- Badge on chat button

## How It Works

### Message Notification Flow

1. **User A sends message to User B**
   ```
   User A → Socket.IO → Server
   ```

2. **Server creates notification**
   ```
   Server → NotificationService → Creates notification in DB
   Server → Emits to User B's socket room
   ```

3. **User B receives notification**
   ```
   User B's browser → Receives 'new-notification' event
   NotificationBell component → Shows badge count increases
   Browser notification → Shows desktop notification
   ```

### Unread Count Flow

1. **Chat button loads**
   ```
   Component → Fetch /messages/unread-by-application
   Server → Returns count per application
   Badge → Shows count if > 0
   ```

2. **New message arrives**
   ```
   Socket.IO → 'new-message' event
   Component → Refreshes unread counts
   Badge → Updates automatically
   ```

3. **User opens chat**
   ```
   ChatModal opens → Messages marked as read
   ChatModal closes → Unread counts refresh
   Badge → Disappears if no unread messages
   ```

## Visual Examples

### Chat Button with Badge
```
┌─────────────────────────┐
│  💬 Continue Chat   (3) │  ← Red badge with count
└─────────────────────────┘
```

### Notification in Header
```
🔔 (1)  ← Bell icon with unread count

Dropdown shows:
📨 New Message
   John Doe sent you a message about "Login Form"
   2 minutes ago
```

## API Endpoints

### Get Unread Counts
```javascript
GET /api/messages/unread-by-application
Headers: Authorization: Bearer <token>

Response: {
  unreadCounts: {
    "675f1234abcd5678": 3,
    "675f5678wxyz1234": 1
  }
}
```

### Get Messages (Auto-marks as read)
```javascript
GET /api/messages/application/:applicationId
Headers: Authorization: Bearer <token>

// Automatically marks messages as read for current user
```

## Testing Steps

### Test Client → Student Message Notification

1. **Login as Student**
   - Go to Dashboard
   - Note: No unread badges initially

2. **Login as Client (different browser/incognito)**
   - Go to "My Jobs" → "Applications"
   - Click "Continue Chat" for a student
   - Send a message: "Hello, when can you start?"

3. **Check Student Side**
   - **Notification Bell**: Should show (1) badge
   - Click bell to see: "New Message - [Client Name] sent you a message..."
   - **Chat Button**: Should show red badge with (1)
   - Click notification or chat button
   - Badge should disappear after viewing messages

### Test Student → Client Message Notification

1. **Login as Student**
   - Go to Dashboard
   - Click "Chat" on an application
   - Send message: "I can start next week"

2. **Check Client Side**
   - **Notification Bell**: Should show (1) badge
   - **Chat Button** in Applications page: Should show (1) badge
   - Click to view message
   - Badges disappear

### Test Real-time Updates

1. **Open both Client and Student in separate browsers**
2. **Send messages back and forth**
3. **Observe**:
   - Messages appear instantly
   - Notification bell badge updates immediately
   - Chat button badge updates immediately
   - No page refresh needed

### Test Multiple Conversations

1. **As Client**, have 3 different students with applications
2. **Each student sends messages** from different browsers
3. **Client side shows**:
   - Notification bell: (3) badge
   - Each chat button: Individual badges (1) per student
4. **Open one chat**:
   - That specific badge disappears
   - Other badges remain

## Database Schema

### Message Collection
```javascript
{
  application: ObjectId,
  sender: ObjectId,
  receiver: ObjectId,
  message: String,
  status: 'sent' | 'delivered' | 'read',
  read: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### Notification Collection (for messages)
```javascript
{
  recipient: ObjectId,
  sender: ObjectId,
  type: 'message',
  title: 'New Message',
  message: '[Name] sent you a message about [Job]',
  link: '/jobs/[jobId]/applications',
  isRead: Boolean,
  createdAt: Date
}
```

## Socket.IO Events

### Client Listens For:
- `new-message` - Triggers unread count refresh
- `new-notification` - Shows in notification bell

### Server Emits To:
- `user:${userId}` room - User-specific notifications
- `application:${applicationId}` room - Chat room messages

## Performance Considerations

- Unread counts cached in state
- Only refreshes on:
  - Component mount
  - New message received (via Socket.IO)
  - Chat closed
- Efficient MongoDB aggregation for counts
- Indexed queries on receiver + read status

## Browser Notification

When a message notification arrives:
- Desktop notification shows (if permitted)
- Title: "New Message"
- Body: "[Sender] sent you a message about [Job]"
- Works even when browser tab is in background

## Files Modified

### Backend
- ✅ `services/notificationService.js` - Added message notification method
- ✅ `services/socketService.js` - Integrated message notifications
- ✅ `routes/messages.js` - Added unread count endpoint

### Frontend
- ✅ `pages/JobApplicationsPage.js` - Added unread count tracking and badge
- ✅ `pages/StudentDashboard.js` - Added unread count tracking and badge

## Troubleshooting

### Badge not showing?
- Check if messages are marked as `read: false` in database
- Verify Socket.IO connection
- Check browser console for API errors

### Notification not appearing?
- Verify Socket.IO is connected
- Check notification permissions in browser
- Look for errors in server logs

### Count not updating?
- Ensure Socket.IO event listeners are active
- Verify `fetchUnreadCounts()` is being called
- Check network tab for API call

## Summary

The messaging notification system now provides:
✅ Real-time message notifications in header
✅ Unread count badges on chat buttons  
✅ Instant updates via Socket.IO
✅ Per-application message tracking
✅ Desktop browser notifications
✅ Automatic badge removal on read
✅ Professional UI with red badges
✅ Efficient database queries

Users will always know when they have new messages, both in the notification bell and directly on the chat buttons!
