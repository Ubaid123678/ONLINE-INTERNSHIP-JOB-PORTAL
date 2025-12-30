import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import socketService from '../services/socketService';

const ChatModal = ({ applicationId, studentName, onClose, show }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [application, setApplication] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [chatPartnerName, setChatPartnerName] = useState(studentName);
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatPartnerId, setChatPartnerId] = useState(null);
  const [chatPartnerProfilePic, setChatPartnerProfilePic] = useState(null);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (show && applicationId) {
      // Connect socket
      socketService.connect();
      
      fetchMessages();
      
      // Join application room
      socketService.joinApplication(applicationId);
      
      // Setup socket listeners
      setupSocketListeners();
    }
    
    return () => {
      if (applicationId) {
        // Leave application room
        socketService.leaveApplication(applicationId);
        
        // Cleanup socket listeners
        cleanupSocketListeners();
      }
    };
  }, [show, applicationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/messages/application/${applicationId}`);
      setMessages(response.data.messages || []);
      setApplication(response.data.application);
      
      // Set chat partner info
      if (response.data.chatPartner) {
        setChatPartnerName(response.data.chatPartner.name);
        setIsOnline(response.data.chatPartner.isOnline);
        setChatPartnerId(response.data.chatPartner.id);
        setChatPartnerProfilePic(response.data.chatPartner.profilePicture);
      }
      
      // Get current user from auth context or token
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data.user || userResponse.data;
      setCurrentUserId(userData.id || userData._id);
      setCurrentUserRole(userData.role);
      
      // Mark as read
      socketService.markAsRead(applicationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // New message received
    socketService.on('new-message', (data) => {
      setMessages(prev => [...prev, data.message]);
      
      // Mark as read if chat is open
      if (show) {
        socketService.markAsRead(applicationId);
      }
    });

    // Message sent confirmation
    socketService.on('message-sent', (data) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.tempId === data.tempId ? data.message : msg
        )
      );
      setSending(false);
    });

    // Message delivered
    socketService.on('message-delivered', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? { ...msg, status: 'delivered', deliveredAt: data.deliveredAt }
            : msg
        )
      );
    });

    // Messages read
    socketService.on('messages-read', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          data.messageIds.includes(msg._id)
            ? { ...msg, status: 'read', read: true, readAt: data.readAt }
            : msg
        )
      );
    });

    // Typing indicator
    socketService.on('user-typing', (data) => {
      if (data.userId === chatPartnerId) {
        setIsTyping(data.typing);
      }
    });

    // Online status
    socketService.on('user-online', (data) => {
      if (data.userId === chatPartnerId) {
        setIsOnline(true);
      }
    });

    socketService.on('user-offline', (data) => {
      if (data.userId === chatPartnerId) {
        setIsOnline(false);
      }
    });

    // Error handling
    socketService.on('error', (data) => {
      console.error('Socket error:', data.message);
      alert(data.message);
    });
  };

  const cleanupSocketListeners = () => {
    socketService.removeAllListeners('new-message');
    socketService.removeAllListeners('message-sent');
    socketService.removeAllListeners('message-delivered');
    socketService.removeAllListeners('messages-read');
    socketService.removeAllListeners('user-typing');
    socketService.removeAllListeners('user-online');
    socketService.removeAllListeners('user-offline');
    socketService.removeAllListeners('error');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    
    // Create temporary message for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      tempId,
      _id: tempId,
      message: newMessage.trim(),
      sender: { _id: currentUserId, name: 'You' },
      receiver: { _id: chatPartnerId },
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
    
    // Add to messages immediately (optimistic update)
    setMessages(prev => [...prev, tempMessage]);
    const messageText = newMessage.trim();
    setNewMessage('');
    
    // Stop typing indicator
    socketService.stopTyping(applicationId);
    
    // Send via socket
    socketService.sendMessage(applicationId, messageText, tempId);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Start typing indicator
    if (e.target.value.trim()) {
      socketService.startTyping(applicationId);
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(applicationId);
      }, 2000);
    } else {
      socketService.stopTyping(applicationId);
    }
  };

  if (!show) return null;

  const getProfilePicUrl = (picPath) => {
    if (!picPath) return null;
    if (picPath.startsWith('http')) return picPath;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/${picPath}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
            <div className="d-flex align-items-center flex-grow-1">
              {/* Profile Picture */}
              {chatPartnerProfilePic && (
                <div 
                  className="position-relative me-3" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowProfilePicModal(true)}
                >
                  <img
                    src={getProfilePicUrl(chatPartnerProfilePic)}
                    alt={chatPartnerName}
                    className="rounded-circle"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover',
                      border: '3px solid white'
                    }}
                  />
                  {isOnline && (
                    <span 
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                      style={{ 
                        width: '14px', 
                        height: '14px',
                        border: '2px solid white'
                      }}
                    ></span>
                  )}
                </div>
              )}
              
              {/* Name and Status */}
              <div className="flex-grow-1">
                <h5 className="modal-title text-white mb-0">
                  <i className="bi bi-chat-dots-fill me-2"></i>
                  {chatPartnerName}
                </h5>
                {application && (
                  <small className="text-white-50">
                    Position: {application.job?.title}
                  </small>
                )}
                {isOnline && (
                  <div>
                    <small className="text-white-50">
                      <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: '0.5rem' }}></i>
                      Online
                    </small>
                  </div>
                )}
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>

          {/* Messages Body */}
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-chat-text text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-3">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="p-3">
                {messages.map((msg, index) => {
                  const senderId = msg.sender._id || msg.sender.id;
                  const isCurrentUser = senderId === currentUserId || senderId?.toString() === currentUserId?.toString();
                  return (
                    <div 
                      key={msg._id || index} 
                      className={`d-flex mb-3 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      <div 
                        className={`p-3 rounded-3 ${
                          isCurrentUser 
                            ? 'bg-primary text-white' 
                            : 'bg-white border'
                        }`}
                        style={{ 
                          maxWidth: '70%',
                          wordBreak: 'break-word'
                        }}
                      >
                        {!isCurrentUser && (
                          <div className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>
                            {msg.sender.name}
                          </div>
                        )}
                        <div>{msg.message}</div>
                        <div 
                          className={`d-flex align-items-center justify-content-between mt-1 ${isCurrentUser ? 'text-white-50' : 'text-muted'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {isCurrentUser && (
                            <span className="ms-2">
                              {msg.status === 'sending' && <i className="bi bi-clock"></i>}
                              {msg.status === 'sent' && <i className="bi bi-check"></i>}
                              {msg.status === 'delivered' && <i className="bi bi-check-all"></i>}
                              {msg.status === 'read' && <i className="bi bi-check-all text-info"></i>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="d-flex mb-3">
                    <div className="bg-white border p-3 rounded-3">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input Footer */}
          <div className="modal-footer" style={{ borderTop: '2px solid #dee2e6' }}>
            <form onSubmit={handleSendMessage} className="w-100">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleTyping}
                  disabled={sending}
                  style={{ borderRadius: '20px 0 0 20px' }}
                />
                <button 
                  className="btn btn-primary px-4" 
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  style={{ borderRadius: '0 20px 20px 0' }}
                >
                  {sending ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <i className="bi bi-send-fill"></i>
                      <span className="ms-2">Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Profile Picture Modal */}
      {showProfilePicModal && chatPartnerProfilePic && (
        <div 
          className="modal fade show d-block" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1060
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowProfilePicModal(false);
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title text-white">{chatPartnerName}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfilePicModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={getProfilePicUrl(chatPartnerProfilePic)}
                  alt={chatPartnerName}
                  className="img-fluid rounded"
                  style={{ maxHeight: '70vh' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Typing Indicator CSS */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #90949c;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatModal;
