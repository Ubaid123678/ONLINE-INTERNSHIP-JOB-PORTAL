import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';

const EditJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ submitting: false, error: null, message: null });
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: '',
    deadline: '',
    budget: ''
  });

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/jobs/${jobId}`);
      const job = data.job;
      setForm({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        description: job.description || '',
        skills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        budget: job.budget || ''
      });
    } catch (err) {
      setStatus({ ...status, error: extractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: null, message: null });

    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        description: form.description,
        requiredSkills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline || undefined,
        budget: form.budget || undefined
      };

      await api.put(`/jobs/${jobId}`, payload);
      setStatus({ submitting: false, error: null, message: 'Job updated successfully!' });
      setTimeout(() => navigate('/my-jobs'), 2000);
    } catch (err) {
      setStatus({ submitting: false, error: extractErrorMessage(err), message: null });
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Section */}
          <div className="text-center mb-3">
            <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 px-3 py-1 rounded-pill mb-2">
              <i className="bi bi-pencil-square text-primary small"></i>
              <span className="text-primary fw-semibold small">EDIT JOB POSTING</span>
            </div>
            <h2 className="fw-bold mb-1">Update Job Listing</h2>
            <p className="text-muted small mb-0">Modify the details of your job posting</p>
          </div>

          {/* Alert Messages */}
          {status.error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center py-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div className="small">{status.error}</div>
              <button type="button" className="btn-close" onClick={() => setStatus({ ...status, error: null })}></button>
            </div>
          )}
          {status.message && (
            <div className="alert alert-success alert-dismissible fade show d-flex align-items-center py-2" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div className="small">{status.message}</div>
              <button type="button" className="btn-close" onClick={() => setStatus({ ...status, message: null })}></button>
            </div>
          )}

          {/* Main Form Card */}
          <div className="card border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            {/* Card Header with Gradient */}
            <div 
              className="card-header py-2 px-3" 
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))',
                borderBottom: 'none'
              }}
            >
              <div className="d-flex align-items-center text-white">
                <div className="bg-white bg-opacity-20 rounded-circle p-2 me-2">
                  <i className="bi bi-pencil-square fs-6"></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Job Details</h5>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="card-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  {/* Job Title */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="title">
                      <i className="bi bi-briefcase text-primary me-1"></i>
                      Job Title <span className="text-danger">*</span>
                    </label>
                    <input 
                      id="title" 
                      name="title" 
                      className="form-control form-control-sm" 
                      value={form.title} 
                      onChange={handleChange} 
                      placeholder="e.g., Frontend Developer"
                      required 
                    />
                  </div>

                  {/* Company Name */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="company">
                      <i className="bi bi-building text-success me-1"></i>
                      Company Name
                    </label>
                    <input 
                      id="company" 
                      name="company" 
                      className="form-control form-control-sm" 
                      value={form.company} 
                      onChange={handleChange} 
                      placeholder="e.g., Tech Solutions"
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="location">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      Location
                    </label>
                    <input 
                      id="location" 
                      name="location" 
                      className="form-control form-control-sm" 
                      value={form.location} 
                      onChange={handleChange} 
                      placeholder="e.g., Remote, Karachi"
                    />
                  </div>

                  {/* Required Skills */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="skills">
                      <i className="bi bi-code-slash text-primary me-1"></i>
                      Required Skills (comma separated)
                    </label>
                    <input 
                      id="skills" 
                      name="skills" 
                      className="form-control form-control-sm" 
                      value={form.skills} 
                      onChange={handleChange} 
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>

                  {/* Budget */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="budget">
                      <i className="bi bi-currency-dollar text-success me-1"></i>
                      Budget/Payment
                    </label>
                    <input 
                      id="budget" 
                      name="budget" 
                      className="form-control form-control-sm" 
                      value={form.budget} 
                      onChange={handleChange} 
                      placeholder="e.g., $500-$1000, PKR 50,000"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="deadline">
                      <i className="bi bi-calendar-event text-warning me-1"></i>
                      Deadline
                    </label>
                    <input 
                      id="deadline" 
                      name="deadline" 
                      type="date" 
                      className="form-control form-control-sm" 
                      value={form.deadline} 
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Job Description */}
                  <div className="col-12">
                    <label className="form-label fw-semibold small mb-1" htmlFor="description">
                      <i className="bi bi-card-text text-info me-1"></i>
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <textarea 
                      id="description" 
                      name="description" 
                      className="form-control form-control-sm" 
                      rows="3" 
                      value={form.description} 
                      onChange={handleChange}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end pt-2 border-top mt-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => navigate('/my-jobs')}
                        disabled={status.submitting}
                      >
                        <i className="bi bi-x-lg me-1"></i>Cancel
                      </button>
                      <button 
                        className="btn btn-accent btn-sm px-4" 
                        type="submit" 
                        disabled={status.submitting}
                      >
                        {status.submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Update Job
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobPage;
