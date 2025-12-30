import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  const primaryCta = user ? '/dashboard' : '/register';

  return (
    <>
      <section className="home-hero">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="hero-badge">INTERNSHIP+JOB_PORTAL</span>
              <h1 className="display-5 fw-semibold mt-3 mb-3">
                Your Gateway to Career Success Through Internships & Jobs
              </h1>
              <p className="lead text-white-50">
                Connect students with top companies. Browse opportunities, apply instantly, and track your applications all in one place. Employers post jobs and find talented candidates effortlessly.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link className="btn-pill" to={primaryCta}>
                  {user ? 'Open Dashboard' : 'Get Started'}
                </Link>
                <Link className="btn-ghost" to="/jobs">
                  Browse Jobs
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-card">
                <p className="text-uppercase text-white-50 small mb-2">Platform Statistics</p>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-chip">
                      <strong>500+</strong>
                      active jobs
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-chip">
                      <strong>100+</strong>
                      companies
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-chip">
                      <strong>1000+</strong>
                      students
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-chip">
                      <strong>24/7</strong>
                      support
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="d-flex justify-content-between text-white-50 small">
                    <span>Students</span>
                    <span>Clients</span>
                    <span>Admin</span>
                  </div>
                  <div className="progress mt-2" role="progressbar" aria-label="Pipeline coverage" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{ width: '70%', background: 'linear-gradient(90deg, var(--brand-green), var(--brand-blue))' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section container py-5">
        <div className="text-center mb-4">
          <p className="text-uppercase text-muted small">How It Works</p>
          <h2 className="fw-semibold">Everything You Need in One Platform</h2>
          <p className="text-muted">Whether you're a student seeking opportunities or a company looking for talent, we've got you covered.</p>
        </div>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card feature-card p-4" style={{ border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="d-flex align-items-center mb-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-blue), #4dabf7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                </div>
                <span className="fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--brand-blue)' }}>For Students</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>Find Your Dream Job</h5>
              <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>Create your profile, upload your resume, and apply to hundreds of internship and job opportunities with just one click.</p>
              <ul className="list-unstyled text-muted" style={{ lineHeight: '2' }}>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="var(--brand-blue)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Search jobs by skills & location</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="var(--brand-blue)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Track all applications</span>
                </li>
                <li className="d-flex align-items-start">
                  <svg width="20" height="20" fill="var(--brand-blue)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Get instant notifications</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card feature-card p-4" style={{ border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="d-flex align-items-center mb-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-green), #20c997)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                  </svg>
                </div>
                <span className="fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--brand-green)' }}>For Companies</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>Hire Top Talent</h5>
              <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>Post job openings, manage applications, and connect with qualified candidates who match your requirements.</p>
              <ul className="list-unstyled text-muted" style={{ lineHeight: '2' }}>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Post unlimited jobs</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Review candidate profiles</span>
                </li>
                <li className="d-flex align-items-start">
                  <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Manage applications easily</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card feature-card p-4" style={{ border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="d-flex align-items-center mb-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, #6c757d, #495057)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                  </svg>
                </div>
                <span className="fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#495057' }}>Platform Features</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>Seamless Experience</h5>
              <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>Enjoy a user-friendly interface with powerful features designed to make job hunting and recruiting effortless.</p>
              <ul className="list-unstyled text-muted" style={{ lineHeight: '2' }}>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="#495057" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Secure and reliable platform</span>
                </li>
                <li className="d-flex align-items-start mb-2">
                  <svg width="20" height="20" fill="#495057" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Real-time updates</span>
                </li>
                <li className="d-flex align-items-start">
                  <svg width="20" height="20" fill="#495057" viewBox="0 0 16 16" style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  <span>Mobile-friendly design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
