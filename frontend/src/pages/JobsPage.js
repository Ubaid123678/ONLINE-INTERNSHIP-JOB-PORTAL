import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';

const fallbackJobs = () => [
  {
    _id: 'demo-1',
    title: 'Frontend Intern',
    company: 'Nexus Labs',
    location: 'Remote',
    skills: ['React', 'Bootstrap', 'REST'],
    status: 'active',
    deadline: '2025-12-31'
  },
  {
    _id: 'demo-2',
    title: 'Talent Acquisition Fellow',
    company: 'BrightHire',
    location: 'Lahore',
    skills: ['Sourcing', 'ATS'],
    status: 'active',
    deadline: '2025-11-10'
  }
];

const JobsPage = () => {
  const [filters, setFilters] = useState({ keyword: '', location: '', skills: '' });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.skills) params.skills = filters.skills;
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs || data);
    } catch (err) {
      setError(extractErrorMessage(err));
      setJobs(fallbackJobs());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJobs();
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px' }}>
      <div className="container">
      <div className="card border-0 mb-4" style={{ background: 'white', borderRadius: '10px' }}>
        <div className="card-body">
          <h2 className="h4 mb-3" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Find opportunities</h2>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label" htmlFor="keyword">
                Keyword
              </label>
              <input
                id="keyword"
                name="keyword"
                className="form-control"
                placeholder="Designer, marketing…"
                value={filters.keyword}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                className="form-control"
                placeholder="Remote, Karachi…"
                value={filters.location}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="skills">
                Skills
              </label>
              <input
                id="skills"
                name="skills"
                className="form-control"
                placeholder="React, data, sales"
                value={filters.skills}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button className="btn text-white" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', border: 'none' }} type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Search jobs'}
              </button>
            </div>
          </form>
          {error && <p className="text-danger small mt-2">{error} — showing demo data.</p>}
        </div>
      </div>

      <div className="row g-3">
        {jobs.map((job) => (
          <div className="col-md-6 col-lg-4" key={job._id}>
            <div className="card h-100" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '10px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="card-body">
                <span className="badge mb-2" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', color: 'white' }}>{job.location || 'Flexible'}</span>
                <h5 className="card-title">{job.title}</h5>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <p className="text-muted mb-0">{job.company || 'Confidential company'}</p>
                  {job.recruiter?._id && (
                    <>
                      <span className="text-muted">•</span>
                      <Link 
                        to={`/profile/${job.recruiter._id}`} 
                        className="text-primary text-decoration-none small"
                      >
                        <i className="bi bi-person-circle me-1"></i>
                        Client
                      </Link>
                    </>
                  )}
                </div>
                <div className="mb-3">
                  {(job.skills || []).slice(0, 3).map((skill) => (
                    <span className="badge me-1" style={{ background: 'rgba(13, 110, 253, 0.1)', color: 'var(--brand-blue)' }} key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
                {job.paymentAmount && (
                  <div className="mb-2 p-2 rounded" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.08), rgba(13, 110, 253, 0.08))', border: '1px solid rgba(0, 200, 150, 0.2)' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-success bg-opacity-10 p-2">
                          <i className="bi bi-cash-coin text-success" style={{ fontSize: '1.1rem' }}></i>
                        </div>
                        <div>
                          <div className="small text-muted mb-0" style={{ fontSize: '0.7rem' }}>
                            {job.paymentType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                          </div>
                          <div className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                            {job.currency || 'USD'} {job.paymentAmount}
                            {job.paymentType === 'hourly' && <span className="text-muted" style={{ fontSize: '0.85rem' }}>/hr</span>}
                          </div>
                        </div>
                      </div>
                      {job.paymentType === 'hourly' && (
                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>Hourly</span>
                      )}
                      {job.paymentType === 'project' && (
                        <span className="badge bg-info text-white" style={{ fontSize: '0.7rem' }}>Project</span>
                      )}
                    </div>
                  </div>
                )}
                {job.budget && !job.paymentAmount && <p className="text-muted small mb-2"><strong>Budget:</strong> {job.budget}<i className="bi bi-currency-dollar text-success ms-1"></i></p>}
                <p className="text-muted small mb-3">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}</p>
                <Link to={`/jobs/${job._id}`} className="btn btn-sm text-white" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', border: 'none' }}>
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && !loading && <p>No jobs found yet. Adjust your filters.</p>}
      </div>
      </div>
    </div>
  );
};

export default JobsPage;
