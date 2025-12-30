import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingModal from '../components/RatingModal';
import RatingDisplay from '../components/RatingDisplay';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [canRate, setCanRate] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/auth/public-profile/${userId}`);
        setProfile(data);
        
        if (user && user.id !== userId && user.role !== data.role) {
          setCanRate(true);
        }
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId, user]);

  const getProfilePictureUrl = () => {
    if (profile?.profile?.profilePicture) {
      return profile.profile.profilePicture.startsWith('http') 
        ? profile.profile.profilePicture 
        : `http://localhost:5000/${profile.profile.profilePicture}`;
    }
    return null;
  };

  const getInitials = () => {
    if (!profile?.name) return '?';
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return profile.name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)', minHeight: '100vh', paddingTop: '80px' }}>
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>

        <div className="row g-4">
          {/* Left Sidebar - Profile Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm overflow-hidden">
              {/* Cover Image */}
              <div 
                className="position-relative"
                style={{ 
                  background: 'linear-gradient(135deg, #00c896 0%, #0d6efd 100%)',
                  height: '120px'
                }}
              >
                <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{ marginBottom: '-60px' }}>
                  <div 
                    className="position-relative rounded-circle border border-4 border-white shadow overflow-hidden bg-white d-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    {getProfilePictureUrl() ? (
                      <img 
                        src={getProfilePictureUrl()} 
                        alt="Profile" 
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="fs-1 text-primary fw-bold">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-body text-center pt-5 mt-3">
                <h4 className="fw-bold mb-2">{profile?.name || 'Anonymous'}</h4>
                <p className="text-muted mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  {profile?.email}
                </p>
                <span className="badge bg-success px-3 py-2 mb-3">
                  <i className="bi bi-briefcase-fill me-2"></i>
                  Client / Recruiter
                </span>

                {/* Statistics */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.1), rgba(0, 200, 150, 0.05))' }}>
                      <div className="fw-bold fs-4" style={{ color: '#00c896' }}>{profile?.stats?.totalJobsPosted || 0}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        Jobs Posted
                      </small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05))' }}>
                      <div className="fw-bold text-primary fs-4">{profile?.stats?.activeJobs || 0}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        Active Jobs
                      </small>
                    </div>
                  </div>
                </div>

                {/* Investment Badge */}
                <div className="p-3 rounded mb-3" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))' }}>
                  <small className="text-muted d-block mb-1">Total Investment</small>
                  <div className="fw-bold text-warning fs-3">
                    ${(profile?.stats?.totalInvestment || 0).toLocaleString()}
                  </div>
                  <small className="text-muted">USD</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Details */}
          <div className="col-lg-8">
            {/* About Section */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <span className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                    <i className="bi bi-person-lines-fill"></i>
                  </span>
                  About
                </h5>
                <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
                  {profile?.profile?.bio || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Company Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                    <i className="bi bi-building"></i>
                  </span>
                  Company Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                      <i className="bi bi-building me-2"></i>Company Name
                    </label>
                    <div className="fw-semibold">{profile?.profile?.company || 'Not provided'}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                      <i className="bi bi-globe me-2"></i>Website
                    </label>
                    <div className="fw-semibold">
                      {profile?.profile?.website ? (
                        <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                          {profile.profile.website} <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                    <i className="bi bi-graph-up"></i>
                  </span>
                  Activity Summary
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <i className="bi bi-briefcase-fill text-primary fs-3 mb-2"></i>
                      <div className="fw-bold fs-5">{profile?.stats?.totalJobsPosted || 0}</div>
                      <small className="text-muted">Total Jobs Posted</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <i className="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
                      <div className="fw-bold fs-5">{profile?.stats?.activeJobs || 0}</div>
                      <small className="text-muted">Currently Active</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 text-center">
                      <i className="bi bi-currency-dollar text-warning fs-3 mb-2"></i>
                      <div className="fw-bold fs-5">${(profile?.stats?.totalInvestment || 0).toLocaleString()}</div>
                      <small className="text-muted">Total Budget</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center">
                    <span className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                      <i className="bi bi-star-fill"></i>
                    </span>
                    Ratings & Reviews
                  </h5>
                  {canRate && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowRatingModal(true)}
                    >
                      <i className="bi bi-star me-2"></i>
                      Rate User
                    </button>
                  )}
                </div>
                <RatingDisplay userId={userId} showReviews={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {canRate && profile && (
        <RatingModal
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          ratedUser={profile}
          onRatingSubmitted={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default PublicProfilePage;
