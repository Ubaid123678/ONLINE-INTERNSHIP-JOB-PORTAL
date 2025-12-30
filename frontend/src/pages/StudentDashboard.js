import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { extractErrorMessage } from '../services/api';
import ChatModal from '../components/ChatModal';
import ProjectSubmissionModal from '../components/ProjectSubmissionModal';
import ProjectSubmissionCard from '../components/ProjectSubmissionCard';
import WalletWidget from '../components/WalletWidget';
import AchievementsCard from '../components/AchievementsCard';
import io from 'socket.io-client';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ applications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [chatStatus, setChatStatus] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedApplicationForSubmit, setSelectedApplicationForSubmit] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);

  const initializeSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    socketRef.current.on('new-message', () => {
      // Refresh unread counts when new message arrives
      fetchUnreadCounts();
    });
  }, []);

  useEffect(() => {
    fetchDashboardData();
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [initializeSocket]);

  useEffect(() => {
    // Check chat status for all applications
    if (applications.length > 0) {
      checkChatStatuses();
      fetchUnreadCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  const fetchUnreadCounts = async () => {
    try {
      const { data } = await api.get('/messages/unread-by-application');
      setUnreadCounts(data.unreadCounts);
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications'),
        api.get('/jobs/summary')
      ]);
      setApplications(appsRes.data.applications || []);
      setStats(statsRes.data || {});
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const checkChatStatuses = async () => {
    const statuses = {};
    for (const app of applications) {
      try {
        const response = await api.get(`/messages/check/${app._id}`);
        statuses[app._id] = response.data.hasMessages;
      } catch (err) {
        statuses[app._id] = false;
      }
    }
    setChatStatus(statuses);
  };

  const handleOpenChat = (application) => {
    setSelectedApplication(application);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedApplication(null);
    // Refresh chat statuses and unread counts after closing
    checkChatStatuses();
    fetchUnreadCounts();
  };

  const handleViewProfile = (recruiter) => {
    setSelectedProfile(recruiter);
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedProfile(null);
  };

  const handleOpenSubmitModal = (application) => {
    setSelectedApplicationForSubmit(application);
    setShowSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedApplicationForSubmit(null);
  };

  const handleSubmitSuccess = () => {
    fetchDashboardData(); // Refresh data to show updated submission status
    handleCloseSubmitModal();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { class: 'bg-primary', text: 'Applied' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' }
    };
    return statusConfig[status] || statusConfig.applied;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Student Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/jobs" className="btn btn-accent">
          Browse Jobs
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
            <div className="card-body position-relative text-white">
              <div className="mb-2">
                <h6 className="mb-0 small text-uppercase" style={{ letterSpacing: '0.5px', opacity: 0.95 }}>Total Applications</h6>
                <h3 className="mb-0 fw-bold">{stats.applications || 0}</h3>
              </div>
              <div className="position-absolute" style={{ bottom: 8, right: 12, opacity: 0.06, fontSize: '4rem', fontWeight: '700' }}>
                {stats.applications || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
            <div className="card-body position-relative text-white">
              <div className="mb-2">
                <h6 className="mb-0 small text-uppercase" style={{ letterSpacing: '0.5px', opacity: 0.95 }}>Shortlisted</h6>
                <h3 className="mb-0 fw-bold">{applications.filter((app) => app.status === 'shortlisted').length}</h3>
              </div>
              <div className="position-absolute" style={{ bottom: 8, right: 12, opacity: 0.06, fontSize: '4rem', fontWeight: '700' }}>
                {applications.filter((app) => app.status === 'shortlisted').length}
              </div>
            </div>
          </div>
        </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
              <div className="card-body position-relative text-white">
                <div className="mb-2">
                  <h6 className="mb-0 small text-uppercase" style={{ letterSpacing: '0.5px', opacity: 0.95 }}>Jobs Done</h6>
                  <h3 className="mb-0 fw-bold">{applications.filter((app) => app.status === 'completed').length}</h3>
                </div>
                <div className="position-absolute" style={{ bottom: 8, right: 12, opacity: 0.06, fontSize: '4rem', fontWeight: '700' }}>
                  {applications.filter((app) => app.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>

        <div className="col-md-3">
          <WalletWidget />
        </div>

        <div className="col-md-3">
          <AchievementsCard userId={user?._id} showFullDetails={false} />
        </div>
      </div>

      {/* Profile Completion */}
      {(!user?.profile?.skills || user.profile.skills.length === 0 || !user?.profile?.resume) && (
        <div className="alert alert-info d-flex align-items-center mb-4">
          <div className="flex-grow-1">
            <h6 className="mb-1">Complete Your Profile</h6>
            <p className="mb-0 small">Add your skills and resume to improve your chances of getting hired!</p>
          </div>
          <Link to="/profile" className="btn btn-sm btn-primary">
            Update Profile
          </Link>
        </div>
      )}

      {/* Applications List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header py-3" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
          <h5 className="mb-0 fw-semibold text-white">My Applications</h5>
        </div>
        <div className="card-body p-0">
          {applications.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mt-3">No applications yet</p>
              <Link to="/jobs" className="btn btn-primary">
                Browse Available Jobs
              </Link>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {applications.map((app) => {
                const statusInfo = getStatusBadge(app.status);
                const hasChat = chatStatus[app._id];
                const canSubmitProject = app.status === 'approved' && !app.projectSubmission?.isSubmitted;
                
                return (
                  <div key={app._id} className="list-group-item p-4" style={{ borderLeft: '6px solid var(--brand-green)', borderRadius: '0', background: '#ffffff' }}>
                    <div className="row align-items-start g-3">
                      {/* Job Details */}
                      <div className="col-md-5">
                        <h6 className="fw-bold mb-2">{app.job?.title || 'N/A'}</h6>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div>
                            <div className="fw-semibold small">
                              {app.job?.recruiter?.name || 'N/A'}
                            </div>
                            <button 
                              className="btn btn-link btn-sm p-0 text-decoration-none"
                              style={{ fontSize: '0.7rem' }}
                              onClick={() => handleViewProfile(app.job.recruiter)}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                        <div className="text-muted small">
                          {app.job?.location || 'Remote'}
                        </div>
                      </div>

                      {/* Application Info */}
                      <div className="col-md-3">
                        <small className="text-muted d-block mb-1">Applied On</small>
                        <div className="fw-semibold small">{new Date(app.createdAt).toLocaleDateString()}</div>
                        <span className={`badge ${statusInfo.class} mt-2`}>
                          {statusInfo.text}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-md-4">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex gap-2">
                            <Link
                              to={`/jobs/${app.job?._id}`}
                              className="btn btn-sm btn-outline-primary flex-fill"
                            >
                              View Job
                            </Link>
                            <button
                              className={`btn btn-sm position-relative ${hasChat ? 'btn-info' : 'btn-outline-info'} flex-fill`}
                              onClick={() => handleOpenChat(app)}
                              title="Chat with recruiter"
                            >
                              {hasChat ? 'Chat' : 'Start'}
                              {unreadCounts[app._id] > 0 && (
                                <span 
                                  className="position-absolute badge rounded-pill bg-danger"
                                  style={{
                                    top: '-5px',
                                    right: '-5px',
                                    fontSize: '0.7rem',
                                    padding: '0.3em 0.6em',
                                    minWidth: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {unreadCounts[app._id] > 99 ? '99+' : unreadCounts[app._id]}
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Project Submit Button */}
                          {canSubmitProject && (
                            <button
                              className="btn btn-sm btn-success w-100"
                              onClick={() => handleOpenSubmitModal(app)}
                            >
                              Submit Project
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Project Submission Card */}
                    {app.projectSubmission?.isSubmitted && (
                      <div className="mt-3">
                        <ProjectSubmissionCard application={app} isStudent={true} />
                        
                        {/* Payment Status */}
                        {app.payment && (
                          <div className="alert alert-info mt-2 mb-0 d-flex align-items-center justify-content-between">
                            <div>
                              <strong className="d-block">Payment Status:</strong>
                              {app.payment.status === 'pending_approval' && (
                                <span className="text-warning">⏳ Pending admin approval</span>
                              )}
                              {app.payment.status === 'released' && (
                                <span className="text-success">✅ Payment released to your wallet ({app.job?.currency || 'USD'} {app.payment.amount})</span>
                              )}
                              {app.payment.status === 'rejected' && (
                                <span className="text-danger">❌ Payment rejected: {app.payment.rejectionReason || 'No reason provided'}</span>
                              )}
                              {app.payment.status === 'not_initiated' && (
                                <span className="text-muted">⚠️ Payment not initiated (client may have insufficient balance)</span>
                              )}
                            </div>
                            {app.payment.amount && (
                              <span className="badge bg-success fs-6">{app.job?.currency || 'USD'} {app.payment.amount}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedApplication && (
        <ChatModal
          applicationId={selectedApplication._id}
          studentName={selectedApplication.job?.recruiter?.name || 'Recruiter'}
          onClose={handleCloseChat}
          show={showChatModal}
        />
      )}

      {/* Project Submission Modal */}
      {showSubmitModal && selectedApplicationForSubmit && (
        <ProjectSubmissionModal
          show={showSubmitModal}
          onHide={handleCloseSubmitModal}
          application={selectedApplicationForSubmit}
          onSubmitted={handleSubmitSuccess}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedProfile && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseProfile}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                <h5 className="modal-title text-white">
                  Recruiter Profile
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseProfile}
                ></button>
              </div>
              <div className="modal-body p-3">
                <div className="text-center mb-3">
                  <h5 className="fw-bold mb-1">{selectedProfile.name}</h5>
                  <p className="text-muted mb-0 small">{selectedProfile.email}</p>
                </div>

                <div className="row g-2">
                  {selectedProfile.profile?.phone && (
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2 px-3">
                          <small className="text-muted d-block mb-1">
                            Phone
                          </small>
                          <div className="fw-semibold">{selectedProfile.profile.phone}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProfile.profile?.location && (
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2 px-3">
                          <small className="text-muted d-block mb-1">
                            Location
                          </small>
                          <div className="fw-semibold">{selectedProfile.profile.location}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProfile.profile?.company && (
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2 px-3">
                          <small className="text-muted d-block mb-1">
                            Company
                          </small>
                          <div className="fw-semibold">{selectedProfile.profile.company}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProfile.profile?.website && (
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2 px-3">
                          <small className="text-muted d-block mb-1">
                            Website
                          </small>
                          <a 
                            href={selectedProfile.profile.website.startsWith('http') ? selectedProfile.profile.website : `https://${selectedProfile.profile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none fw-semibold"
                          >
                            {selectedProfile.profile.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProfile.profile?.bio && (
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2 px-3">
                          <small className="text-muted d-block mb-1">
                            About
                          </small>
                          <div>{selectedProfile.profile.bio}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
