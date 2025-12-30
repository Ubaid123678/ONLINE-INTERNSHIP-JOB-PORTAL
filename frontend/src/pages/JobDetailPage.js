import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const demoJob = {
  title: 'Product Design Intern',
  company: 'Studio North',
  description: 'Collaborate with the product pod to design flows, produce prototypes, and polish UI states.',
  location: 'Hybrid — Islamabad',
  skills: ['Figma', 'User research', 'System thinking'],
  status: 'active',
  deadline: '2025-12-31'
};

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyState, setApplyState] = useState({ sending: false, message: null, error: null });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/jobs/${jobId}`);
        setJob(data.job || data);
      } catch (err) {
        setJob({ _id: jobId, ...demoJob });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${jobId}` } } });
      return;
    }
    if (!isStudent) {
      setApplyState({ sending: false, message: null, error: 'Only students can apply to jobs.' });
      return;
    }

    setApplyState({ sending: true, message: null, error: null });
    try {
      await api.post('/applications', { job: jobId });
      setApplyState({ sending: false, message: 'Application sent. Check your inbox for updates.', error: null });
    } catch (err) {
      setApplyState({ sending: false, message: null, error: extractErrorMessage(err) });
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '20px' }}>
        <div className="container">
        <p>Loading job…</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '20px' }}>
        <div className="container">
        <p>Job not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px' }}>
      <div className="container">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div className="card-body p-4">
              <h1 className="h3 mb-1" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>{job.title}</h1>
              <div className="d-flex align-items-center gap-2 mb-3">
                <p className="text-muted mb-0">{job.company || 'Confidential company'}</p>
                {job.recruiter?._id && (
                  <>
                    <span className="text-muted">•</span>
                    <Link 
                      to={`/profile/${job.recruiter._id}`} 
                      className="text-primary text-decoration-none small"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      View Client Profile
                    </Link>
                  </>
                )}
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', color: 'white' }}>{job.location || 'Flexible'}</span>
                <span className="badge" style={{ background: 'rgba(0, 200, 150, 0.2)', color: 'var(--brand-green)' }}>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}</span>
                <span className="badge text-capitalize" style={{ background: 'rgba(0, 200, 150, 0.2)', color: 'var(--brand-green)' }}>{job.status || 'active'}</span>
              </div>
              
              {/* Payment Information Card */}
              {job.paymentAmount && (
                <div className="mb-4 p-3 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.1), rgba(13, 110, 253, 0.1))', border: '2px solid rgba(0, 200, 150, 0.3)' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
                        <i className="bi bi-cash-coin text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <div className="text-muted small mb-1" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {job.paymentType === 'hourly' ? '💼 Hourly Rate' : '📦 Fixed Project Budget'}
                        </div>
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#00c896' }}>
                          {job.currency || 'USD'} {job.paymentAmount}
                          {job.paymentType === 'hourly' && <span className="text-muted" style={{ fontSize: '1rem' }}>/hour</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      {job.paymentType === 'hourly' && (
                        <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: '0.85rem' }}>⏱️ Hourly</span>
                      )}
                      {job.paymentType === 'project' && (
                        <span className="badge bg-info text-white px-3 py-2" style={{ fontSize: '0.85rem' }}>📋 Project-Based</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-top border-success border-opacity-25">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      {job.paymentType === 'hourly' ? 'You will be paid based on hours worked' : 'Fixed payment upon project completion'}
                    </small>
                  </div>
                </div>
              )}
              {job.budget && !job.paymentAmount && (
                <div className="alert alert-info mb-4">
                  <strong><i className="bi bi-currency-dollar me-1"></i>Budget:</strong> {job.budget}
                </div>
              )}
              <h5 style={{ color: 'var(--brand-blue)', fontWeight: 'bold' }}>About the opportunity</h5>
              <p className="text-muted">{job.description || demoJob.description}</p>
              <h6 className="mt-4" style={{ color: 'var(--brand-blue)', fontWeight: 'bold' }}>Skills & tools</h6>
              <div className="d-flex flex-wrap gap-2">
                {(job.skills || demoJob.skills).map((skill) => (
                  <span className="badge" style={{ background: 'rgba(13, 110, 253, 0.1)', color: 'var(--brand-blue)' }} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div className="card-body p-4">
              <h5 className="mb-3" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Apply for this role</h5>
              <p className="text-muted small">
                Upload your resume on the dashboard before applying. Recruiters receive instant alerts.
              </p>
              {applyState.error && <div className="alert alert-danger">{applyState.error}</div>}
              {applyState.message && <div className="alert alert-success">{applyState.message}</div>}
              <button className="btn w-100 text-white" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', border: 'none' }} type="button" onClick={handleApply} disabled={applyState.sending}>
                {applyState.sending ? 'Submitting…' : isStudent ? 'Apply now' : 'Students only'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
