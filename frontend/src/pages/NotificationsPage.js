import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? '?unreadOnly=true' : '';
      const { data } = await api.get(`/notifications${params}`);
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications(prev =>
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleClearRead = async () => {
    if (!window.confirm('Are you sure you want to clear all read notifications?')) return;
    
    try {
      await api.delete('/notifications/clear/read');
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return { icon: 'bi-file-earmark-text-fill', color: 'primary' };
      case 'project_submission':
        return { icon: 'bi-folder-check', color: 'success' };
      case 'status_change':
        return { icon: 'bi-arrow-repeat', color: 'info' };
      case 'new_job':
        return { icon: 'bi-briefcase-fill', color: 'warning' };
      case 'message':
        return { icon: 'bi-chat-dots-fill', color: 'primary' };
      default:
        return { icon: 'bi-bell-fill', color: 'secondary' };
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return notifDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: notifDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div 
              className="card-body p-4" 
              style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}
            >
              <div className="d-flex align-items-center justify-content-between text-white">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <h1 className="h3 mb-0 fw-bold">Notifications</h1>
                    <p className="mb-0 opacity-90">
                      {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {unreadCount > 0 && (
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={handleMarkAllRead}
                    >
                      <i className="bi bi-check-all me-1"></i>
                      Mark all read
                    </button>
                  )}
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={handleClearRead}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="row justify-content-center mb-3">
        <div className="col-lg-10">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              <i className="bi bi-list-ul me-2"></i>
              All Notifications
            </button>
            <button
              type="button"
              className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('unread')}
            >
              <i className="bi bi-envelope-fill me-2"></i>
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-bell-slash fs-1 text-muted"></i>
                </div>
                <h5 className="text-muted">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </h5>
                <p className="text-muted small">
                  {filter === 'unread' 
                    ? "You're all caught up!" 
                    : "When you receive notifications, they'll appear here"}
                </p>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
              <div className="list-group list-group-flush">
                {notifications.map((notification) => {
                  const iconConfig = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification._id}
                      className={`list-group-item list-group-item-action ${
                        !notification.isRead ? 'bg-light' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ cursor: 'pointer', borderLeft: !notification.isRead ? '4px solid var(--bs-primary)' : 'none' }}
                    >
                      <div className="d-flex align-items-start gap-3 py-2">
                        <div className="flex-shrink-0">
                          <div
                            className={`rounded-circle bg-${iconConfig.color} bg-opacity-10 d-flex align-items-center justify-content-center`}
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className={`bi ${iconConfig.icon} text-${iconConfig.color} fs-4`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0 fw-bold">{notification.title}</h6>
                            {!notification.isRead && (
                              <span className="badge bg-primary rounded-pill">New</span>
                            )}
                          </div>
                          <p className="mb-2 text-muted">{notification.message}</p>
                          {notification.sender && (
                            <div className="d-flex align-items-center gap-2 mb-2">
                              {notification.sender.profile?.profilePicture ? (
                                <img
                                  src={`http://localhost:5000/${notification.sender.profile.profilePicture}`}
                                  alt={notification.sender.name}
                                  className="rounded-circle"
                                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                                  style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}
                                >
                                  {notification.sender.name?.charAt(0)}
                                </div>
                              )}
                              <small className="text-muted">From {notification.sender.name}</small>
                            </div>
                          )}
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {formatTime(notification.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
