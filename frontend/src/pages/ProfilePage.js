import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { extractErrorMessage } from '../services/api';
import RatingDisplay from '../components/RatingDisplay';

const ProfilePage = () => {
  const { user, isStudent } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: user?.profile?.skills || [],
    resume: user?.profile?.resume || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    company: user?.profile?.company || '',
    website: user?.profile?.website || '',
    profilePicture: user?.profile?.profilePicture || ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ applications: 0, jobs: 0, views: 0 });
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isStudent) {
          const { data } = await api.get('/applications/my-applications');
          setStats({
            applications: data.length,
            jobs: data.filter(app => app.status === 'accepted').length,
            views: 0
          });
        } else {
          const { data } = await api.get('/jobs/my-jobs');
          const totalApplications = data.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
          setStats({
            jobs: data.length,
            applications: totalApplications,
            views: data.reduce((sum, job) => sum + (job.views || 0), 0)
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }));
  };

  const handleProfilePictureClick = () => {
    if (editing) {
      fileInputRef.current?.click();
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'danger', text: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'Image size should be less than 5MB' });
      return;
    }

    setUploadingPicture(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const { data } = await api.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile((prev) => ({ ...prev, profilePicture: data.profilePicture }));
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'danger', text: extractErrorMessage(err) });
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'danger', text: 'Please upload a PDF file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'File size should be less than 5MB' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await api.post('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile((prev) => ({ ...prev, resume: data.resume }));
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: extractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        name: profile.name,
        profile: {
          skills: profile.skills,
          resume: profile.resume,
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          company: profile.company,
          website: profile.website,
          profilePicture: profile.profilePicture
        }
      };
      
      console.log('Sending profile update:', payload);
      
      const response = await api.patch('/auth/profile', payload);
      
      console.log('Profile update response:', response.data);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ type: 'danger', text: extractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = () => {
    if (profile.profilePicture) {
      const timestamp = new Date().getTime(); // Add cache-busting timestamp
      const baseUrl = profile.profilePicture.startsWith('http') 
        ? profile.profilePicture 
        : `http://localhost:5000/${profile.profilePicture}`;
      return `${baseUrl}?t=${timestamp}`;
    }
    return null;
  };

  const getInitials = () => {
    if (!profile.name) return '?';
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return profile.name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show shadow-sm`} role="alert">
            <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

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
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      cursor: editing ? 'pointer' : 'default'
                    }}
                    onClick={handleProfilePictureClick}
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
                    {editing && (
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
                        style={{ transition: 'all 0.3s' }}
                      >
                        {uploadingPicture ? (
                          <span className="spinner-border text-white"></span>
                        ) : (
                          <i className="bi bi-camera-fill text-white fs-3"></i>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              </div>

              <div className="card-body text-center pt-5 mt-3">
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    className="form-control text-center fw-bold mb-2"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                  />
                ) : (
                  <h4 className="fw-bold mb-2">{profile.name || 'Anonymous User'}</h4>
                )}
                <p className="text-muted mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  {profile.email}
                </p>
                <span className={`badge ${isStudent ? 'bg-primary' : 'bg-success'} px-3 py-2 mb-3`}>
                  <i className={`bi ${isStudent ? 'bi-mortarboard-fill' : 'bi-briefcase-fill'} me-2`}></i>
                  {isStudent ? 'Student' : 'Client'}
                </span>

                {/* Quick Stats */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.1), rgba(0, 200, 150, 0.05))' }}>
                      <div className="fw-bold fs-4" style={{ color: '#00c896' }}>{stats.jobs}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        {isStudent ? 'Jobs' : 'Posts'}
                      </small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05))' }}>
                      <div className="fw-bold text-primary fs-4">{stats.applications}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        {isStudent ? 'Apps' : 'Apps'}
                      </small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))' }}>
                      <div className="fw-bold text-warning fs-4">{stats.views}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Views</small>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!editing ? (
                  <button 
                    className="btn btn-lg w-100 text-white fw-semibold shadow-sm" 
                    style={{ background: 'linear-gradient(135deg, #00c896, #0d6efd)' }}
                    onClick={() => setEditing(true)}
                  >
                    <i className="bi bi-pencil-square me-2"></i>Edit Profile
                  </button>
                ) : (
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-success btn-lg fw-semibold shadow-sm" 
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-lg" 
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
                {editing ? (
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="4"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your experience, goals, and what makes you unique..."
                  />
                ) : (
                  <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
                    {profile.bio || 'I\'m a dedicated Web Developer who loves creating responsive and dynamic websites. I specialize in modern web technologies and enjoy turning ideas into functional web solutions.'}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <span className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                    <i className="bi bi-telephone-fill"></i>
                  </span>
                  Contact Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                      <i className="bi bi-telephone me-2"></i>Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="+1 (234) 567-8900"
                      />
                    ) : (
                      <div className="fw-semibold">{profile.phone || 'Not provided'}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                      <i className="bi bi-geo-alt me-2"></i>Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="fw-semibold">{profile.location || 'Not provided'}</div>
                    )}
                  </div>
                  {!isStudent && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                          <i className="bi bi-building me-2"></i>Company
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="company"
                            className="form-control"
                            value={profile.company}
                            onChange={handleChange}
                            placeholder="Company name"
                          />
                        ) : (
                          <div className="fw-semibold">{profile.company || 'Not provided'}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                          <i className="bi bi-globe me-2"></i>Website
                        </label>
                        {editing ? (
                          <input
                            type="url"
                            name="website"
                            className="form-control"
                            value={profile.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                          />
                        ) : (
                          <div className="fw-semibold">
                            {profile.website ? (
                              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                                {profile.website} <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                              </a>
                            ) : (
                              'Not provided'
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section - For Students */}
            {isStudent && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <span className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                      <i className="bi bi-lightbulb-fill"></i>
                    </span>
                    Skills & Expertise
                  </h5>
                  
                  {editing && (
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a skill (e.g., JavaScript, Python, Design)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button className="btn btn-primary" onClick={addSkill}>
                        <i className="bi bi-plus-lg me-2"></i>Add
                      </button>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 d-flex align-items-center gap-2"
                          style={{ fontSize: '0.9rem', fontWeight: '500' }}
                        >
                          {skill}
                          {editing && (
                            <button
                              className="btn-close btn-close-sm"
                              style={{ fontSize: '0.65rem' }}
                              onClick={() => removeSkill(skill)}
                            ></button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        {editing ? 'Add your skills to showcase your expertise' : 'No skills added yet'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Resume Section - For Students */}
            {isStudent && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <span className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3">
                      <i className="bi bi-file-earmark-pdf-fill"></i>
                    </span>
                    Resume / CV
                  </h5>
                  
                  {profile.resume ? (
                    <div className="d-flex align-items-center justify-content-between p-3 rounded border">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-danger bg-opacity-10 text-danger rounded p-3">
                          <i className="bi bi-file-pdf fs-3"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Resume.pdf</div>
                          <small className="text-muted">PDF Document</small>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <a 
                          href={`http://localhost:5000/${profile.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          <i className="bi bi-eye me-2"></i>View
                        </a>
                        {editing && (
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => resumeInputRef.current?.click()}
                          >
                            <i className="bi bi-arrow-clockwise me-2"></i>Replace
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                        <i className="bi bi-cloud-upload text-muted fs-1"></i>
                      </div>
                      <p className="text-muted mb-3">No resume uploaded yet</p>
                      {editing && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => resumeInputRef.current?.click()}
                        >
                          <i className="bi bi-upload me-2"></i>Upload Resume
                        </button>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    className="d-none"
                    onChange={handleResumeUpload}
                  />
                </div>
              </div>
            )}

            {/* Ratings Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <span className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 me-3">
                    <i className="bi bi-star-fill"></i>
                  </span>
                  Ratings & Reviews
                </h5>
                {user?._id && <RatingDisplay userId={user._id} showReviews={true} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
