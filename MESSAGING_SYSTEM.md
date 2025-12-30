# WhatsApp-Like Real-Time Messaging System

## Overview
This application now includes a real-time messaging system similar to WhatsApp, built with Socket.io. Messages are sent and received instantly, with delivery and read receipts, typing indicators, and online status.

## Features Implemented

### 1. **Real-Time Messaging**
- Messages are sent and received instantly via WebSocket
- No page refresh required
- Optimistic UI updates for instant feedback

### 2. **Message Status Indicators** (Like WhatsApp)
- ⏰ **Sending**: Single clock icon - message is being sent
- ✓ **Sent**: Single check mark - message sent to server
- ✓✓ **Delivered**: Double check mark - message delivered to recipient
- ✓✓ **Read**: Double check mark (blue) - message read by recipient

### 3. **Online/Offline Status**
- Green dot indicator shows when the chat partner is online
- Real-time updates when users come online or go offline
- Displayed in chat header

### 4. **Typing Indicators**
- See when the other person is typing
- Animated three-dot indicator
- Automatically stops after 2 seconds of inactivity

### 5. **Application-Specific Chats**
- Each job application has its own chat room
- Only the student who applied and the client who posted the job can access the chat
- Complete privacy and security

### 6. **Message Persistence**
- All messages are stored in MongoDB
- Message history is preserved
- Delivery and read timestamps are tracked

## Technical Implementation

### Backend Architecture

#### Socket.io Server ([backend/services/socketService.js](backend/services/socketService.js))
- Handles WebSocket connections
- JWT authentication for socket connections
- Room-based messaging (one room per application)
- Real-time event handlers:
  - `join-application` - Join a chat room
  - `send-message` - Send a new message
  - `typing-start/stop` - Typing indicators
  - `mark-as-read` - Mark messages as read
  - `user-online/offline` - Online status tracking

#### Enhanced Message Model ([backend/models/message.js](backend/models/message.js))
```javascript
{
  application: ObjectId,      // Link to job application
  sender: ObjectId,            // User who sent the message
  receiver: ObjectId,          // User who receives the message
  message: String,             // Message content
  status: 'sent|delivered|read', // Message status
  read: Boolean,               // Read flag
  readAt: Date,                // When message was read
  deliveredAt: Date,           // When message was delivered
  createdAt: Date,             // When message was created
  updatedAt: Date              // Last update
}
```

#### Server Setup ([backend/server.js](backend/server.js))
- HTTP server with Socket.io integration
- CORS configured for WebSocket connections
- Socket service initialized on server start

### Frontend Architecture

#### Socket Service ([frontend/src/services/socketService.js](frontend/src/services/socketService.js))
- Singleton pattern for socket connection management
- Automatic reconnection on disconnect
- Event-based architecture
- Methods:
  - `connect()` - Establish WebSocket connection
  - `disconnect()` - Close connection
  - `joinApplication()` - Join chat room
  - `sendMessage()` - Send message
  - `startTyping()/stopTyping()` - Typing indicators
  - `markAsRead()` - Mark messages as read

#### Enhanced ChatModal ([frontend/src/components/ChatModal.js](frontend/src/components/ChatModal.js))
- Real-time message updates
- Optimistic UI updates
- Online status display
- Typing indicators
- Message status icons
- Auto-scroll to latest message

#### Auth Integration ([frontend/src/context/AuthContext.js](frontend/src/context/AuthContext.js))
- Socket connection on login
- Socket disconnection on logout
- Automatic reconnection when authenticated

## How It Works

### Message Flow

1. **Sending a Message**
   ```
   User types → Frontend creates temp message → Displays immediately
   → Socket emits to server → Server saves to DB → Server confirms to sender
   → Server sends to receiver (if online) → Updates status to 'delivered'
   ```

2. **Receiving a Message**
   ```
   Server sends via socket → Frontend receives → Displays in chat
   → Auto-marks as read (if chat is open) → Notifies sender
   ```

3. **Status Updates**
   ```
   Sent → Message saved in DB
   Delivered → Receiver is online and received the message
   Read → Receiver viewed the message
   ```

### Online Status

- Users are tracked in a Map when they connect
- When a user connects: `user-online` event broadcasted
- When a user disconnects: `user-offline` event broadcasted
- Chat partner's online status displayed in real-time

### Typing Indicators

- Typing starts when user types
- Typing stops after 2 seconds of inactivity
- Other user sees animated three-dot indicator
- Stops when message is sent or input is cleared

## Security Features

1. **JWT Authentication**: All socket connections require valid JWT token
2. **Access Control**: Users can only access chats for their own applications
3. **Room Isolation**: Each application has its own chat room
4. **Authorization Checks**: Server verifies permissions before allowing actions

## Database Indexes

For optimal performance, the following indexes are created:
```javascript
- { application: 1, createdAt: 1 }  // For fetching messages
- { receiver: 1, read: 1 }          // For unread counts
- { receiver: 1, status: 1 }        // For status queries
```

## Testing the System

### Test Scenario 1: Real-Time Messaging
1. Login as a client
2. View applications for a job
3. Open chat with a student
4. Send a message
5. Login as that student in another browser
6. See the message appear instantly

### Test Scenario 2: Status Updates
1. Send a message when receiver is offline (✓ sent)
2. Receiver logs in (✓✓ delivered)
3. Receiver opens the chat (✓✓ read - blue)

### Test Scenario 3: Typing Indicator
1. Open chat as client
2. Open same chat as student in another browser
3. Start typing - other user sees "typing..."

### Test Scenario 4: Online Status
1. Open chat
2. Have other user login - see green dot appear
3. Have other user logout - see green dot disappear

## API Endpoints (REST - Fallback)

While real-time messaging uses WebSockets, REST endpoints are still available:

- `GET /api/messages/application/:applicationId` - Get all messages
- `POST /api/messages` - Send a message (fallback)
- `GET /api/messages/unread-count` - Get unread message count
- `GET /api/messages/check/:applicationId` - Check if chat exists

## Environment Variables

No additional environment variables required. Uses existing:
- `JWT_SECRET` - For socket authentication
- `PORT` - Server port (default: 5000)

## Browser Compatibility

Works with all modern browsers that support WebSocket:
- Chrome/Edge (v14+)
- Firefox (v11+)
- Safari (v6+)
- Opera (v12+)

## Performance Considerations

1. **Connection Pooling**: Socket.io handles connection pooling automatically
2. **Room-Based Broadcasting**: Only sends to users in the same application room
3. **Efficient Updates**: Only updates affected messages, not entire list
4. **Optimistic Updates**: UI updates immediately before server confirmation
5. **Debounced Typing**: Typing events are throttled to reduce server load

## Future Enhancements

Potential features to add:
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Message reactions (emoji)
- [ ] Message deletion
- [ ] Message editing
- [ ] Push notifications
- [ ] Desktop notifications
- [ ] Unread message badges
- [ ] Group chats
- [ ] Message search

## Troubleshooting

### Messages not appearing in real-time
- Check browser console for WebSocket connection errors
- Verify JWT token is valid
- Check server logs for authentication errors
- Ensure CORS is properly configured

### Status not updating
- Verify receiver is online
- Check socket connection status
- Ensure both users are in the same application room

### Typing indicator not showing
- Check socket connection
- Verify event listeners are properly set up
- Check for JavaScript errors in console

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs for backend issues
3. Verify network connectivity
4. Ensure all dependencies are installed
