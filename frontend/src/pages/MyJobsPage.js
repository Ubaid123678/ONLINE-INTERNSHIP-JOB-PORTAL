import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMine = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/jobs/mine');
        setJobs(data.jobs || []);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchMine();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

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
              <div className="d-flex align-items-center gap-2 text-white">
                <div>
                  <p className="text-uppercase small mb-1 opacity-90 fw-semibold">
                    <i className="bi bi-building me-1"></i>
                    Recruiter Workspace
                  </p>
                  <h1 className="h3 mb-0 fw-bold">My Job Postings</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row justify-content-center mb-3">
          <div className="col-lg-11">
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="row justify-content-center">
        <div className="col-lg-11">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            <div className="card-header bg-light border-0 py-3 px-4">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-list-ul text-primary me-2"></i>
                  All Listings
                </h5>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid var(--brand-green)' }}>
                  <tr>
                    <th className="fw-semibold py-3 px-4">
                      <i className="bi bi-briefcase text-primary me-2"></i>Title
                    </th>
                    <th className="fw-semibold py-3">
                      <i className="bi bi-building text-success me-2"></i>Company
                    </th>
                    <th className="fw-semibold py-3">
                      <i className="bi bi-geo-alt text-danger me-2"></i>Location
                    </th>
                    <th className="fw-semibold py-3">
                      <i className="bi bi-currency-dollar text-success me-2"></i>Payment
                    </th>
                    <th className="fw-semibold py-3">
                      <i className="bi bi-circle-fill text-info me-2" style={{ fontSize: '0.5rem' }}></i>Status
                    </th>
                    <th className="fw-semibold py-3">
                      <i className="bi bi-calendar-event text-warning me-2"></i>Deadline
                    </th>
                    <th className="fw-semibold py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2 mb-0">Loading your jobs...</p>
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                          <i className="bi bi-inbox fs-1 text-primary"></i>
                        </div>
                        <h5 className="text-muted mb-2">No Jobs Posted Yet</h5>
                        <p className="text-muted small mb-3">Start by posting your first job opportunity</p>
                        <Link to="/post-job" className="btn btn-accent btn-sm px-4">
                          <i className="bi bi-plus-circle me-2"></i>Create Your First Job
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td className="px-4 py-3">
                          <div className="fw-semibold text-dark">{job.title}</div>
                        </td>
                        <td className="py-3">
                          <span className="text-muted">{job.company || '—'}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-muted">{job.location || 'Flexible'}</span>
                        </td>
                        <td className="py-3">
                          {job.paymentAmount ? (
                            <div>
                              <span className="text-success fw-semibold small">
                                {job.currency} {job.paymentAmount}
                              </span>
                              <br />
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {job.paymentType === 'hourly' ? 'Per hour' : 'Fixed'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted small">{job.budget || '—'}</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span 
                            className={`badge ${
                              job.status === 'completed' 
                                ? 'bg-info bg-opacity-10 text-info'
                                : job.status === 'active' 
                                ? 'bg-success bg-opacity-10 text-success' 
                                : 'bg-secondary bg-opacity-10 text-secondary'
                            } text-capitalize px-3 py-2`}
                          >
                            <i className={`bi bi-circle-fill me-1`} style={{ fontSize: '0.5rem' }}></i>
                            {job.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-muted small">
                            {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}
                          </span>
                        </td>
                        <td className="py-3 text-end px-4">
                          <div className="d-flex gap-2 justify-content-end flex-wrap">
                            <Link 
                              className="btn btn-sm btn-primary" 
                              to={`/jobs/${job._id}`}
                            >
                              <i className="bi bi-eye-fill me-1"></i>
                              View
                            </Link>
                            <Link 
                              className="btn btn-sm btn-info text-white" 
                              to={`/jobs/${job._id}/applications`}
                            >
                              <i className="bi bi-person-lines-fill me-1"></i>
                              Applications
                            </Link>
                            <button 
                              className="btn btn-sm btn-danger" 
                              type="button" 
                              onClick={() => handleDelete(job._id)}
                            >
                              <i className="bi bi-trash-fill me-1"></i>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
