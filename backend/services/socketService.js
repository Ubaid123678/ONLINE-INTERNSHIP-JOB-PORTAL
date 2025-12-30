const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const Application = require('../models/application');
const NotificationService = require('./notificationService');

// Store online users: { userId: socketId }
const onlineUsers = new Map();
// Store typing status: { applicationId: { userId: boolean } }
const typingUsers = new Map();

const initializeSocket = (io) => {
  // Middleware for authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store online user
    onlineUsers.set(socket.userId, socket.id);
    
    // Join user-specific room for notifications
    socket.join(`user:${socket.userId}`);
    
    // Emit online status to all clients
    io.emit('user-online', { userId: socket.userId });

    // Join application-specific rooms
    socket.on('join-application', async (applicationId) => {
      try {
        // Verify user has access to this application
        const application = await Application.findById(applicationId)
          .populate({
            path: 'job',
            populate: { 
              path: 'recruiter',
              select: 'name email profile.profilePicture'
            }
          })
          .populate('student', 'name email profile.profilePicture');
        
        if (!application) {
          socket.emit('error', { message: 'Application not found' });
          return;
        }

        const isStudent = application.student._id.toString() === socket.userId;
        const isRecruiter = application.job.recruiter._id.toString() === socket.userId;
        
        if (!isStudent && !isRecruiter) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(`application:${applicationId}`);
        console.log(`User ${socket.userId} joined application ${applicationId}`);
        
        // Mark messages as delivered when user joins
        await markMessagesAsDelivered(socket.userId, applicationId, io);
      } catch (error) {
        console.error('Error joining application:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { applicationId, message } = data;
        
        if (!message || !message.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        // Verify application and permissions
        const application = await Application.findById(applicationId)
          .populate({
            path: 'job',
            populate: { path: 'recruiter', select: 'name email profile.profilePicture' }
          })
          .populate('student', 'name email profile.profilePicture');
        
        if (!application) {
          socket.emit('error', { message: 'Application not found' });
          return;
        }

        const isStudent = application.student._id.toString() === socket.userId;
        const isRecruiter = application.job.recruiter._id.toString() === socket.userId;
        
        if (!isStudent && !isRecruiter) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        const receiverId = isStudent ? application.job.recruiter._id : application.student._id;
        
        // Check if receiver is online
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        const initialStatus = receiverSocketId ? 'delivered' : 'sent';
        
        // Create message
        const newMessage = new Message({
          application: applicationId,
          sender: socket.userId,
          receiver: receiverId,
          message: message.trim(),
          status: initialStatus,
          deliveredAt: receiverSocketId ? new Date() : null
        });
        
        await newMessage.save();
        await newMessage.populate('sender', 'name email profile.profilePicture');
        await newMessage.populate('receiver', 'name email profile.profilePicture');

        // Create notification for receiver about new message (only if not in chat)
        if (!receiverSocketId || true) { // Always create notification for tracking
          try {
            const NotificationServiceClass = require('./notificationService');
            const notificationService = new NotificationServiceClass(io);
            await notificationService.notifyNewMessage(newMessage, application, application.job);
          } catch (notifError) {
            console.error('Failed to create message notification:', notifError);
          }
        }

        // Emit to sender (confirmation)
        socket.emit('message-sent', {
          tempId: data.tempId,
          message: newMessage
        });

        // Emit to receiver in real-time
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new-message', {
            message: newMessage
          });
          
          // Emit delivery confirmation to sender
          socket.emit('message-delivered', {
            messageId: newMessage._id,
            deliveredAt: newMessage.deliveredAt
          });
        }

        // Broadcast to application room
        socket.to(`application:${applicationId}`).emit('new-message', {
          message: newMessage
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing-start', (data) => {
      const { applicationId } = data;
      
      if (!typingUsers.has(applicationId)) {
        typingUsers.set(applicationId, new Map());
      }
      typingUsers.get(applicationId).set(socket.userId, true);
      
      socket.to(`application:${applicationId}`).emit('user-typing', {
        userId: socket.userId,
        applicationId,
        typing: true
      });
    });

    socket.on('typing-stop', (data) => {
      const { applicationId } = data;
      
      if (typingUsers.has(applicationId)) {
        typingUsers.get(applicationId).delete(socket.userId);
      }
      
      socket.to(`application:${applicationId}`).emit('user-typing', {
        userId: socket.userId,
        applicationId,
        typing: false
      });
    });

    // Handle marking messages as read
    socket.on('mark-as-read', async (data) => {
      try {
        const { applicationId } = data;
        
        // Update all unread messages for this user in this application
        const result = await Message.updateMany(
          { 
            application: applicationId, 
            receiver: socket.userId,
            status: { $ne: 'read' }
          },
          { 
            status: 'read',
            read: true,
            readAt: new Date()
          }
        );

        if (result.modifiedCount > 0) {
          // Get the updated messages
          const readMessages = await Message.find({
            application: applicationId,
            receiver: socket.userId,
            status: 'read'
          }).select('_id sender readAt');

          // Notify senders that their messages were read
          readMessages.forEach(msg => {
            const senderSocketId = onlineUsers.get(msg.sender.toString());
            if (senderSocketId) {
              io.to(senderSocketId).emit('messages-read', {
                applicationId,
                messageIds: readMessages.map(m => m._id),
                readAt: msg.readAt
              });
            }
          });

          socket.emit('marked-as-read', { 
            applicationId, 
            count: result.modifiedCount 
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Failed to mark messages as read' });
      }
    });

    // Handle leave application
    socket.on('leave-application', (applicationId) => {
      socket.leave(`application:${applicationId}`);
      console.log(`User ${socket.userId} left application ${applicationId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      
      // Emit offline status
      io.emit('user-offline', { userId: socket.userId });
      
      // Clear typing status
      typingUsers.forEach((users, applicationId) => {
        if (users.has(socket.userId)) {
          users.delete(socket.userId);
          io.to(`application:${applicationId}`).emit('user-typing', {
            userId: socket.userId,
            applicationId,
            typing: false
          });
        }
      });
    });
  });

  return io;
};

// Helper function to mark messages as delivered
const markMessagesAsDelivered = async (userId, applicationId, io) => {
  try {
    const result = await Message.updateMany(
      {
        application: applicationId,
        receiver: userId,
        status: 'sent'
      },
      {
        status: 'delivered',
        deliveredAt: new Date()
      }
    );

    if (result.modifiedCount > 0) {
      // Notify senders
      const deliveredMessages = await Message.find({
        application: applicationId,
        receiver: userId,
        status: 'delivered'
      }).populate('sender');

      deliveredMessages.forEach(msg => {
        const senderSocketId = onlineUsers.get(msg.sender._id.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit('message-delivered', {
            messageId: msg._id,
            deliveredAt: msg.deliveredAt
          });
        }
      });
    }
  } catch (error) {
    console.error('Error marking messages as delivered:', error);
  }
};

// Get online status for a user
const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

// Get all online users
const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

module.exports = {
  initializeSocket,
  isUserOnline,
  getOnlineUsers
};
