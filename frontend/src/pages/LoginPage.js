import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(form);
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'var(--brand-light)' }}>
      <div className="row g-0 shadow-lg" style={{ maxWidth: '1100px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden' }}>
        {/* Left Side - Platform Info */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
          <div className="text-white p-5" style={{ maxWidth: '450px' }}>
            <h1 className="display-5 fw-bold mb-4">Welcome Back!</h1>
            <p className="mb-4">Sign in to continue your journey with our comprehensive internship and job portal.</p>
            
            <div className="mb-3">
              <h5 className="fw-semibold">🎯 Track Your Progress</h5>
              <p className="small opacity-90">Monitor your applications and stay updated on opportunities.</p>
            </div>
            
            <div className="mb-3">
              <h5 className="fw-semibold">💡 Discover More</h5>
              <p className="small opacity-90">Access exclusive internships and job postings tailored for you.</p>
            </div>
            
            <div>
              <h5 className="fw-semibold">🤝 Connect & Grow</h5>
              <p className="small opacity-90">Build your professional network and advance your career.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-5 d-flex flex-column align-items-center justify-content-center p-5 bg-white">
          <div className="mb-4" style={{ maxWidth: '380px', width: '100%' }}>
            <h2 className="fw-bold mb-2">Sign In</h2>
            <p className="text-muted">Welcome back to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ maxWidth: '380px', width: '100%' }}>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: '380px', width: '100%' }}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="password">
                Password <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              className="btn btn-accent w-100 mb-3" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-muted mb-0" style={{ maxWidth: '380px', width: '100%' }}>
            Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
