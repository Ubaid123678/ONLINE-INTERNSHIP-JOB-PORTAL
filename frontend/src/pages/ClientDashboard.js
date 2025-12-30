import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { extractErrorMessage } from '../services/api';
import WalletWidget from '../components/WalletWidget';
import AchievementsCard from '../components/AchievementsCard';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ jobsPosted: 0, applications: 0, applicants: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/jobs/mine'),
        api.get('/jobs/summary')
      ]);
      setJobs(jobsRes.data.jobs || []);
      setStats(statsRes.data || {});
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      fetchDashboardData();
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      setJobs((prev) =>
        prev.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job))
      );
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div 
              className="card-body p-4" 
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))'
              }}
            >
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 text-white">
                <div>
                  <h2 className="h4 mb-1 fw-bold">Client Dashboard</h2>
                  <p className="mb-0 opacity-90">Welcome back, {user?.name}!</p>
                </div>
                <Link 
                  to="/post-job" 
                  className="btn btn-light btn-lg px-4 fw-semibold"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Post New Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row justify-content-center mb-3">
          <div className="col-lg-11">
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center">
              <div>{error}</div>
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="row g-3">
            {/* Jobs Posted Card */}
            <div className="col-md-3">
              <div className="card border-0 shadow-lg h-100 overflow-hidden" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                <div className="card-body p-4 position-relative text-white">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="rounded-circle" style={{ background: 'rgba(255,255,255,0.12)', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" fill="currentColor" className="text-white" viewBox="0 0 16 16">
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 small text-uppercase" style={{ letterSpacing: '0.5px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>Jobs Posted</p>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: '2rem', color: '#ffffff' }}>{stats.jobsPosted || 0}</h2>
                    <div className="d-flex gap-2 mt-3">
                      <div style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Active: {jobs.filter(j => j.status === 'active').length}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Closed: {jobs.filter(j => j.status === 'closed').length}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Processing: {jobs.filter(j => j.status === 'processing').length}
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute" style={{ bottom: 0, right: 0, opacity: 0.06, fontSize: '6rem', fontWeight: 'bold', lineHeight: 1, color: 'rgba(255,255,255,0.9)' }}>
                    {stats.jobsPosted || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Applications Card */}
            <div className="col-md-3">
              <div className="card border-0 shadow-lg h-100 overflow-hidden" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                <div className="card-body p-4 position-relative text-white">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="rounded-circle" style={{ background: 'rgba(255,255,255,0.12)', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" fill="currentColor" className="text-white" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 small text-uppercase" style={{ letterSpacing: '0.5px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>Total Applications</p>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: '2rem', color: '#ffffff' }}>{stats.applications || 0}</h2>
                    <div className="d-flex gap-2 mt-3">
                      <div style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Applicants: {stats.applicants || 0}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Avg / Job: {Math.round((stats.applications || 0) / (stats.jobsPosted || 1))}
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute" style={{ bottom: 0, right: 0, opacity: 0.06, fontSize: '6rem', fontWeight: 'bold', lineHeight: 1, color: 'rgba(255,255,255,0.9)' }}>
                    {stats.applications || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Jobs Card */}
            <div className="col-md-3">
              <div className="card border-0 shadow-lg h-100 overflow-hidden" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                <div className="card-body p-4 position-relative text-white">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="rounded-circle" style={{ background: 'rgba(255,255,255,0.12)', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" fill="currentColor" className="text-white" viewBox="0 0 16 16">
                        <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zM5.5 8a.5.5 0 0 1 .5-.5H8V5.5a.5.5 0 0 1 1 0V7.5h2a.5.5 0 0 1 0 1H9v2a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1-.5-.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 small text-uppercase" style={{ letterSpacing: '0.5px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>Completed Jobs</p>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: '2rem', color: '#ffffff' }}>{stats.completed || stats.completedJobs || 0}</h2>
                    <div className="d-flex gap-2 mt-3 align-items-center">
                      <div style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Last: {jobs.filter(j => j.status === 'completed').slice(-1)[0]?.title || '—'}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 10px', borderRadius: '999px', fontSize: '0.9rem' }}>
                        Total: {jobs.filter(j => j.status === 'completed').length}
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute" style={{ bottom: 0, right: 0, opacity: 0.06, fontSize: '6rem', fontWeight: 'bold', lineHeight: 1, color: 'rgba(255,255,255,0.9)' }}>
                    {stats.completed || stats.completedJobs || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet at right */}
            <div className="col-md-3">
              <WalletWidget />
            </div>

          </div>
        </div>
      </div>

      {/* Achievements row (moved below) */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="row g-3">
            <div className="col-md-3">
              <AchievementsCard userId={user?._id} showFullDetails={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Posted Jobs */}
      <div className="row justify-content-center">
        <div className="col-lg-11">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div className="card-header bg-light border-0 py-3 px-4">
              <h5 className="mb-0 fw-bold">
                My Job Postings
              </h5>
            </div>
            
            {/* Status Filter Tabs */}
            <div className="px-4 pt-3 pb-0">
              <ul className="nav nav-pills gap-2">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All Jobs ({jobs.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active ({jobs.filter(j => j.status === 'active').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${statusFilter === 'processing' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('processing')}
                  >
                    Processing ({jobs.filter(j => j.status === 'processing').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${statusFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed ({jobs.filter(j => j.status === 'completed').length})
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body p-0">
              {jobs.filter(j => statusFilter === 'all' || j.status === statusFilter).length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted mb-2">{statusFilter === 'all' ? 'No Jobs Posted Yet' : `No ${statusFilter} jobs`}</h5>
                  <p className="text-muted small mb-3">{statusFilter === 'all' ? 'Start by posting your first job opportunity' : `You don't have any ${statusFilter} jobs at the moment`}</p>
                  {statusFilter === 'all' && (
                    <Link to="/post-job" className="btn btn-accent px-4">
                      Post Your First Job
                    </Link>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid var(--brand-green)' }}>
                      <tr>
                        <th className="fw-semibold py-3 px-4">
                          Job Title
                        </th>
                        <th className="fw-semibold py-3">
                          Location
                        </th>
                        <th className="fw-semibold py-3">
                          Status
                        </th>
                        <th className="fw-semibold py-3">
                          Posted On
                        </th>
                        <th className="fw-semibold py-3 text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.filter(j => statusFilter === 'all' || j.status === statusFilter).map((job) => {
                        const isActive = job.status === 'active';
                        const isProcessing = job.status === 'processing';
                        const isCompleted = job.status === 'completed';
                        const canEdit = !isProcessing && !isCompleted;
                        
                        let statusBadgeClass = 'bg-secondary bg-opacity-10 text-secondary';
                        if (isActive) statusBadgeClass = 'bg-success bg-opacity-10 text-success';
                        if (isProcessing) statusBadgeClass = 'bg-warning bg-opacity-10 text-warning';
                        if (isCompleted) statusBadgeClass = 'bg-info bg-opacity-10 text-info';
                        
                        const toggleBtnClass = isActive ? 'btn-warning' : 'btn-success';
                        const toggleText = isActive ? 'Close' : 'Open';

                        return (
                          <tr key={job._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td className="px-4 py-3">
                              <div>
                                <div className="fw-semibold text-dark">{job.title}</div>
                                <small className="text-muted">{job.company}</small>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="text-muted">{job.location || 'Remote'}</span>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${statusBadgeClass} text-capitalize px-3 py-2`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="text-muted small">{new Date(job.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="py-3 text-end px-4">
                              <div className="d-flex gap-2 justify-content-end flex-wrap">
                                <Link 
                                  to={`/jobs/${job._id}/applications`} 
                                  className="btn btn-sm btn-primary" 
                                  title="View Applications"
                                >
                                  View
                                </Link>
                                <Link 
                                  to={`/edit-job/${job._id}`} 
                                  className={`btn btn-sm btn-secondary ${!canEdit ? 'disabled' : ''}`}
                                  title={canEdit ? 'Edit Job' : `Cannot edit ${job.status} jobs`}
                                  {...(!canEdit && { onClick: (e) => e.preventDefault() })}
                                >
                                  Edit
                                </Link>
                                {isActive && (
                                  <button
                                    className={`btn btn-sm ${toggleBtnClass}`}
                                    onClick={() => handleToggleStatus(job._id, job.status)}
                                    title={isActive ? 'Close Job' : 'Activate Job'}
                                  >
                                    {toggleText}
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteJob(job._id)}
                                  title={canEdit ? 'Delete Job' : `Cannot delete ${job.status} jobs`}
                                  disabled={!canEdit}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
