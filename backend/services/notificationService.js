const Notification = require('../models/notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'name email profile.profilePicture')
        .populate('relatedJob', 'title company');

      // Emit real-time notification to recipient
      if (this.io) {
        this.io.to(`user:${data.recipient}`).emit('new-notification', populatedNotification);
      }

      return populatedNotification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  async notifyNewApplication(application, job) {
    await this.createNotification({
      recipient: job.recruiter,
      sender: application.student,
      type: 'application',
      title: 'New Application Received',
      message: `New application for "${job.title}"`,
      link: `/jobs/${job._id}/applications`,
      relatedJob: job._id,
      relatedApplication: application._id
    });
  }

  async notifyProjectSubmission(application, job, student) {
    await this.createNotification({
      recipient: job.recruiter,
      sender: student._id,
      type: 'project_submission',
      title: 'Project Submitted',
      message: `${student.name} submitted a project for "${job.title}"`,
      link: `/jobs/${job._id}/applications`,
      relatedJob: job._id,
      relatedApplication: application._id
    });
  }

  async notifyStatusChange(application, job, recruiter, newStatus) {
    const statusMessages = {
      approved: '✅ Your application has been approved!',
      rejected: '❌ Your application has been rejected',
      accepted: '🎉 You have been accepted for the position!',
      'in-progress': '🚀 Your work is now in progress',
      completed: '✨ Project marked as completed'
    };

    await this.createNotification({
      recipient: application.student,
      sender: recruiter._id,
      type: 'status_change',
      title: `Application Status Updated`,
      message: statusMessages[newStatus] || `Application status changed to ${newStatus} for "${job.title}"`,
      link: `/dashboard`,
      relatedJob: job._id,
      relatedApplication: application._id
    });
  }

  async notifyNewJob(job, studentIds) {
    // Create notifications for all students
    const notifications = studentIds.map(studentId => ({
      recipient: studentId,
      sender: job.recruiter,
      type: 'new_job',
      title: 'New Job Posted',
      message: `New opportunity: "${job.title}" at ${job.company || 'a company'}`,
      link: `/jobs/${job._id}`,
      relatedJob: job._id
    }));

    if (notifications.length > 0) {
      const created = await Notification.insertMany(notifications);
      
      // Emit to all students
      if (this.io) {
        created.forEach(notification => {
          this.io.to(`user:${notification.recipient}`).emit('new-notification', notification);
        });
      }
    }
  }

  async notifyNewMessage(message, application, job) {
    // Don't create notification if it's a message notification (to avoid spam)
    // Instead, we'll handle this via socket events and unread counts
    const sender = message.sender;
    const receiver = message.receiver;

    await this.createNotification({
      recipient: receiver._id || receiver,
      sender: sender._id || sender,
      type: 'message',
      title: 'New Message',
      message: `${sender.name || 'Someone'} sent you a message about "${job.title}"`,
      link: `/jobs/${job._id}/applications`,
      relatedJob: job._id,
      relatedApplication: application._id
    });
  }

  async notifyPaymentReleased(application, job, student) {
    await this.createNotification({
      recipient: student._id,
      sender: job.recruiter,
      type: 'payment',
      title: '💰 Payment Released',
      message: `Payment of ${job.currency || 'USD'} ${application.payment.amount} has been approved and added to your wallet for "${job.title}"`,
      link: `/wallet`,
      relatedJob: job._id,
      relatedApplication: application._id
    });
  }
}

module.exports = NotificationService;
