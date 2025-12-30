import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    skills: '',
    deadline: '',
    budget: '',
    paymentType: 'project',
    paymentAmount: '',
    currency: 'USD'
  });
  const [status, setStatus] = useState({ submitting: false, message: null, error: null });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ submitting: true, message: null, error: null });
    try {
      const payload = { ...form, skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean) };
      await api.post('/jobs', payload);
      setStatus({ submitting: false, message: 'Job posted successfully!', error: null });
      setForm({ title: '', company: '', description: '', location: '', skills: '', deadline: '', budget: '', paymentType: 'project', paymentAmount: '', currency: 'USD' });
      // Redirect to my jobs after 2 seconds
      setTimeout(() => navigate('/my-jobs'), 2000);
    } catch (err) {
      setStatus({ submitting: false, message: null, error: extractErrorMessage(err) });
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Section */}
          <div className="text-center mb-3">
            <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 px-3 py-1 rounded-pill mb-2">
              <i className="bi bi-briefcase-fill text-primary small"></i>
              <span className="text-primary fw-semibold small">POST A NEW OPPORTUNITY</span>
            </div>
            <h2 className="fw-bold mb-1">Create Job Listing</h2>
            <p className="text-muted small mb-0">Fill in the details to post your opportunity</p>
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
                      Budget/Payment (Optional)
                    </label>
                    <input 
                      id="budget" 
                      name="budget" 
                      className="form-control form-control-sm" 
                      value={form.budget} 
                      onChange={handleChange} 
                      placeholder="e.g., 500$-1000$, PKR 50,000"
                    />
                  </div>

                  {/* Payment Type */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="paymentType">
                      <i className="bi bi-cash-stack text-primary me-1"></i>
                      Payment Type <span className="text-danger">*</span>
                    </label>
                    <select 
                      id="paymentType" 
                      name="paymentType" 
                      className="form-select form-select-sm" 
                      value={form.paymentType} 
                      onChange={handleChange}
                      required
                    >
                      <option value="project">Fixed Price (Complete Project)</option>
                      <option value="hourly">Hourly Rate</option>
                    </select>
                  </div>

                  {/* Payment Amount */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small mb-1" htmlFor="paymentAmount">
                      <i className="bi bi-currency-exchange text-success me-1"></i>
                      Amount <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-sm">
                      <select 
                        name="currency" 
                        className="form-select" 
                        value={form.currency} 
                        onChange={handleChange}
                        style={{ maxWidth: '80px' }}
                      >
                        <option value="USD">USD</option>
                        <option value="PKR">PKR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <input 
                        id="paymentAmount" 
                        name="paymentAmount" 
                        type="number" 
                        className="form-control" 
                        value={form.paymentAmount} 
                        onChange={handleChange} 
                        placeholder={form.paymentType === 'hourly' ? 'Per hour' : 'Total amount'}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <small className="text-muted">
                      {form.paymentType === 'hourly' ? 'Rate per hour' : 'Total project cost'}
                    </small>
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
                            Publishing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>
                            Publish Job
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

export default PostJobPage;
