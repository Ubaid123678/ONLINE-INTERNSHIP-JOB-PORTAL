import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem('portal_token');
    if (!token) {
      console.error('No token found for socket connection');
      return null;
    }

    const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupDefaultListeners();
    
    return this.socket;
  }

  setupDefaultListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Join an application chat room
  joinApplication(applicationId) {
    if (this.socket) {
      this.socket.emit('join-application', applicationId);
    }
  }

  // Leave an application chat room
  leaveApplication(applicationId) {
    if (this.socket) {
      this.socket.emit('leave-application', applicationId);
    }
  }

  // Send a message
  sendMessage(applicationId, message, tempId) {
    if (this.socket) {
      this.socket.emit('send-message', { applicationId, message, tempId });
    }
  }

  // Typing indicators
  startTyping(applicationId) {
    if (this.socket) {
      this.socket.emit('typing-start', { applicationId });
    }
  }

  stopTyping(applicationId) {
    if (this.socket) {
      this.socket.emit('typing-stop', { applicationId });
    }
  }

  // Mark messages as read
  markAsRead(applicationId) {
    if (this.socket) {
      this.socket.emit('mark-as-read', { applicationId });
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
