import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';
import ChatModal from '../components/ChatModal';
import ProjectSubmissionCard from '../components/ProjectSubmissionCard';
import io from 'socket.io-client';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [chatStatus, setChatStatus] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    fetchData();
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    // Check chat status for all applications
    if (applications.length > 0) {
      checkChatStatuses();
      fetchUnreadCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  const initializeSocket = () => {
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
  };

  const fetchUnreadCounts = async () => {
    try {
      const { data } = await api.get('/messages/unread-by-application');
      setUnreadCounts(data.unreadCounts);
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get('/applications')
      ]);
      setJob(jobRes.data.job);
      // Filter applications for this specific job
      const jobApplications = appsRes.data.applications.filter(
        (app) => app.job._id === jobId
      );
      setApplications(jobApplications);
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

  const handleViewProfile = (student) => {
    setSelectedProfile(student);
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedProfile(null);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    // Check if chat has been initiated before allowing status change
    if (!chatStatus[applicationId]) {
      alert('Please chat with the applicant before accepting or rejecting their application.');
      return;
    }

    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      applied: { class: 'bg-primary', text: 'Approved', icon: 'bi-file-earmark-text' },
      approved: { class: 'bg-success', text: 'Approved', icon: 'bi-check-circle' },
      rejected: { class: 'bg-danger', text: 'Rejected', icon: 'bi-x-circle' }
    };
    return config[status] || config.applied;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Back Button & Header */}
      <div className="row justify-content-center mb-3">
        <div className="col-lg-11">
          <button 
            className="btn btn-link text-decoration-none ps-0 mb-2" 
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
          
          {/* Header Card with Gradient */}
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div 
              className="card-body p-4" 
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))'
              }}
            >
              <div className="d-flex align-items-center gap-3 text-white">
                <div>
                  <h2 className="h4 mb-1 fw-bold">Applications for "{job?.title}"</h2>
                  <p className="mb-0 opacity-90">
                    <i className="bi bi-building me-2"></i>{job?.company || 'Company'}
                    <span className="mx-2">•</span>
                    <i className="bi bi-geo-alt me-2"></i>{job?.location || 'Remote'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '0.75rem' }}>
                <div className="card-body text-center py-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-secondary bg-opacity-10 rounded-circle p-2">
                      <i className="bi bi-file-earmark-text-fill text-secondary fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0">{applications.length}</h3>
                  <small className="text-muted fw-semibold">Total</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '0.75rem' }}>
                <div className="card-body text-center py-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                      <i className="bi bi-clock-fill text-primary fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0 text-primary">
                    {applications.filter((a) => a.status === 'applied').length}
                  </h3>
                  <small className="text-muted fw-semibold">Pending</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '0.75rem' }}>
                <div className="card-body text-center py-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2">
                      <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0 text-success">
                    {applications.filter((a) => a.status === 'approved').length}
                  </h3>
                  <small className="text-muted fw-semibold">Approved</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '0.75rem' }}>
                <div className="card-body text-center py-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-2">
                      <i className="bi bi-x-circle-fill text-danger fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-0 text-danger">
                    {applications.filter((a) => a.status === 'rejected').length}
                  </h3>
                  <small className="text-muted fw-semibold">Rejected</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="row justify-content-center">
        <div className="col-lg-11">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div className="card-header bg-light border-0 py-3 px-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-person-lines-fill text-primary me-2"></i>
                  Applicants
                </h5>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'applied' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('applied')}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilterStatus('approved')}
                  >
                    Approved
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilterStatus('rejected')}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-5">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-inbox fs-1 text-primary"></i>
                  </div>
                  <h5 className="text-muted mb-2">No applications found</h5>
                  <p className="text-muted small">
                    {filterStatus === 'all' 
                      ? 'No one has applied to this job yet.' 
                      : `No ${filterStatus} applications.`}
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredApplications.map((app) => {
                    const statusInfo = getStatusBadge(app.status);
                    return (
                      <div key={app._id} className="list-group-item p-4" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <div className="row align-items-center g-3">
                          <div className="col-md-4">
                            <div className="d-flex align-items-center gap-3">
                              {app.student?.profile?.profilePicture ? (
                                <img
                                  src={`http://localhost:5000/${app.student.profile.profilePicture}`}
                                  alt={app.student.name}
                                  className="rounded-circle"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }}
                                  onClick={() => handleViewProfile(app.student)}
                                />
                              ) : (
                                <div 
                                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                                  style={{ width: '50px', height: '50px', flexShrink: 0, cursor: 'pointer' }}
                                  onClick={() => handleViewProfile(app.student)}
                                >
                                  <i className="bi bi-person-fill text-primary fs-4"></i>
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <h6 className="mb-0 fw-semibold text-truncate">{app.student?.name}</h6>
                                <small className="text-muted text-truncate d-block">{app.student?.email}</small>
                                <button 
                                  className="btn btn-link btn-sm p-0 text-decoration-none"
                                  onClick={() => handleViewProfile(app.student)}
                                >
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <small className="text-muted d-block mb-1">Applied on</small>
                            <div className="fw-semibold small">{new Date(app.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="col-md-2">
                            <span className={`badge ${statusInfo.class} px-3 py-2`}>
                              <i className={`bi ${statusInfo.icon} me-1`}></i>
                              {statusInfo.text}
                            </span>
                          </div>
                          <div className="col-md-2">
                            {app.resume ? (
                              <a
                                href={`http://localhost:5000/${app.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-secondary w-100"
                              >
                                <i className="bi bi-file-earmark-pdf-fill me-1"></i>View Resume
                              </a>
                            ) : (
                              <span className="text-muted small">No resume</span>
                            )}
                          </div>
                          <div className="col-md-2">
                            <button
                              className={`btn btn-sm w-100 mb-2 position-relative ${chatStatus[app._id] ? 'btn-info' : 'btn-outline-info'}`}
                              onClick={() => handleOpenChat(app)}
                              title="Chat with applicant"
                            >
                              <i className="bi bi-chat-dots-fill me-1"></i>
                              {chatStatus[app._id] ? 'Continue Chat' : 'Start Chat'}
                              {unreadCounts[app._id] > 0 && (
                                <span 
                                  className="position-absolute badge rounded-pill bg-danger"
                                  style={{
                                    top: '-8px',
                                    right: '-8px',
                                    fontSize: '0.65rem',
                                    padding: '0.25em 0.5em',
                                    minWidth: '18px'
                                  }}
                                >
                                  {unreadCounts[app._id] > 99 ? '99+' : unreadCounts[app._id]}
                                </span>
                              )}
                            </button>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-success flex-fill"
                                onClick={() => handleStatusChange(app._id, 'approved')}
                                disabled={app.status === 'approved' || !chatStatus[app._id]}
                                title={!chatStatus[app._id] ? 'Chat required before approval' : 'Approve applicant'}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger flex-fill"
                                onClick={() => handleStatusChange(app._id, 'rejected')}
                                disabled={app.status === 'rejected' || !chatStatus[app._id]}
                                title={!chatStatus[app._id] ? 'Chat required before rejection' : 'Reject'}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </div>
                          </div>

                          {/* Project Submission Card */}
                          {app.projectSubmission?.isSubmitted && (
                            <div className="col-12 mt-3">
                              <ProjectSubmissionCard application={app} isStudent={false} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedApplication && (
        <ChatModal
          applicationId={selectedApplication._id}
          studentName={selectedApplication.student?.name}
          onClose={handleCloseChat}
          show={showChatModal}
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
                  <i className="bi bi-person-circle me-2"></i>
                  Applicant Profile
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseProfile}
                ></button>
              </div>
              <div className="modal-body p-0">
                {/* Profile Header */}
                <div className="text-center p-3 pb-2" style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)' }}>
                  {selectedProfile.profile?.profilePicture ? (
                    <img
                      src={`http://localhost:5000/${selectedProfile.profile.profilePicture}`}
                      alt={selectedProfile.name}
                      className="rounded-circle mb-2 border border-3 border-white shadow"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 border border-3 border-white shadow"
                      style={{ width: '100px', height: '100px' }}
                    >
                      <i className="bi bi-person-fill text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                  )}
                  <h5 className="fw-bold mb-1">{selectedProfile.name}</h5>
                  <p className="text-muted mb-0 small">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {selectedProfile.email}
                  </p>
                </div>

                {/* Profile Details */}
                <div className="p-3">
                  <h6 className="text-uppercase text-muted fw-semibold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                    Contact Information
                  </h6>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <div className="card border h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary bg-opacity-10 rounded p-1 me-2">
                              <i className="bi bi-telephone-fill text-primary" style={{ fontSize: '0.85rem' }}></i>
                            </div>
                            <small className="text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>Phone Number</small>
                          </div>
                          <div className="fw-semibold ms-4" style={{ fontSize: '0.9rem' }}>
                            {selectedProfile.profile?.phone || <span className="text-muted fst-italic">Not provided</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border h-100 shadow-sm">
                        <div className="card-body py-2 px-3">
                          <div className="d-flex align-items-center mb-1">
                            <div className="bg-success bg-opacity-10 rounded p-1 me-2">
                              <i className="bi bi-geo-alt-fill text-success" style={{ fontSize: '0.85rem' }}></i>
                            </div>
                            <small className="text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>Location</small>
                          </div>
                          <div className="fw-semibold ms-4" style={{ fontSize: '0.9rem' }}>
                            {selectedProfile.profile?.location || <span className="text-muted fst-italic">Not provided</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <h6 className="text-uppercase text-muted fw-semibold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                    About
                  </h6>
                  <div className="card border shadow-sm mb-3">
                    <div className="card-body py-2 px-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-info bg-opacity-10 rounded p-1 me-2 mt-1">
                          <i className="bi bi-person-badge-fill text-info" style={{ fontSize: '0.85rem' }}></i>
                        </div>
                        <div className="flex-grow-1">
                          {selectedProfile.profile?.bio ? (
                            <p className="mb-0 small" style={{ lineHeight: '1.5' }}>{selectedProfile.profile.bio}</p>
                          ) : (
                            <p className="text-muted fst-italic mb-0 small">No bio provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <h6 className="text-uppercase text-muted fw-semibold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                    Skills & Expertise
                  </h6>
                  <div className="card border shadow-sm mb-3">
                    <div className="card-body py-2 px-3">
                      {selectedProfile.profile?.skills && selectedProfile.profile.skills.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {selectedProfile.profile.skills.map((skill, index) => (
                            <span key={index} className="badge bg-primary bg-gradient px-2 py-1" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-check-circle-fill me-1"></i>
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted fst-italic mb-0 small">
                          <i className="bi bi-info-circle me-2" style={{ fontSize: '0.85rem' }}></i>
                          No skills listed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resume Section */}
                  <h6 className="text-uppercase text-muted fw-semibold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                    Resume & Documents
                  </h6>
                  <div className="card border shadow-sm">
                    <div className="card-body text-center py-3">
                      {selectedProfile.profile?.resume ? (
                        <>
                          <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
                          </div>
                          <h6 className="mb-2 small">Resume Available</h6>
                          <a
                            href={`http://localhost:5000/${selectedProfile.profile.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-danger px-3 py-2"
                          >
                            <i className="bi bi-download me-2"></i>
                            Download Resume
                          </a>
                        </>
                      ) : (
                        <>
                          <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-file-earmark-x text-secondary fs-4"></i>
                          </div>
                          <p className="text-muted fst-italic mb-0 small">No resume uploaded</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;
