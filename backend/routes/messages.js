const express = require('express');
const Message = require('../models/message');
const Application = require('../models/application');
const auth = require('../middleware/auth');
const { isUserOnline } = require('../services/socketService');
const mongoose = require('mongoose');

const router = express.Router();

// Get messages for a specific application
router.get('/application/:applicationId', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
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
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (!application.job || !application.job.recruiter) {
      return res.status(500).json({ message: 'Job or recruiter information missing' });
    }
    
    // Check if user is either the student or the job owner
    const isStudent = application.student._id.toString() === req.user.id.toString();
    const isRecruiter = application.job.recruiter._id.toString() === req.user.id.toString();
    
    if (!isStudent && !isRecruiter) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const messages = await Message.find({ application: applicationId })
      .populate('sender', 'name email profile.profilePicture')
      .populate('receiver', 'name email profile.profilePicture')
      .sort({ createdAt: 1 });
    
    // Mark messages as read if user is the receiver
    await Message.updateMany(
      { application: applicationId, receiver: req.user.id, status: { $ne: 'read' } },
      { status: 'read', read: true, readAt: new Date() }
    );
    
    // Get online status of chat partner
    const chatPartnerId = isStudent ? application.job.recruiter._id : application.student._id;
    const isOnline = isUserOnline(chatPartnerId.toString());
    
    res.json({ 
      messages, 
      application,
      chatPartner: {
        id: chatPartnerId,
        name: isStudent ? application.job.recruiter.name : application.student.name,
        email: isStudent ? application.job.recruiter.email : application.student.email,
        profilePicture: isStudent 
          ? application.job.recruiter.profile?.profilePicture 
          : application.student.profile?.profilePicture,
        isOnline
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { applicationId, message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }
    
    // Verify application exists and get details
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
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (!application.job || !application.job.recruiter) {
      return res.status(500).json({ message: 'Job or recruiter information missing' });
    }
    
    // Determine sender and receiver
    const isStudent = application.student._id.toString() === req.user.id.toString();
    const isRecruiter = application.job.recruiter._id.toString() === req.user.id.toString();
    
    if (!isStudent && !isRecruiter) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const receiverId = isStudent ? application.job.recruiter._id : application.student._id;
    
    const newMessage = new Message({
      application: applicationId,
      sender: req.user.id,
      receiver: receiverId,
      message: message.trim()
    });
    
    await newMessage.save();
    await newMessage.populate('sender', 'name email profile.profilePicture');
    await newMessage.populate('receiver', 'name email profile.profilePicture');
    
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get unread message count for user
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if chat exists for an application
router.get('/check/:applicationId', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const messageCount = await Message.countDocuments({ application: applicationId });
    
    res.json({ hasMessages: messageCount > 0, messageCount });
  } catch (error) {
    console.error('Error checking messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count per application for current user
router.get('/unread-by-application', auth, async (req, res) => {
  try {
    const unreadMessages = await Message.aggregate([
      {
        $match: {
            receiver: new mongoose.Types.ObjectId(req.user.id),
            read: false
          }
      },
      {
        $group: {
          _id: '$application',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    unreadMessages.forEach(item => {
      result[item._id.toString()] = item.count;
    });

    res.json({ unreadCounts: result });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
