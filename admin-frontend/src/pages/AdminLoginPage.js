import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
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
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-app">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            {/* Logo/Brand Section */}
            <div className="text-center mb-4">
              <div className="d-inline-block p-3 rounded-circle mb-3" 
                   style={{
                     background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(0, 200, 150, 0.1) 100%)',
                     border: '2px solid rgba(13, 110, 253, 0.2)'
                   }}>
                <i className="bi bi-shield-lock-fill fs-1" 
                   style={{
                     background: 'linear-gradient(120deg, #00c896, #0d6efd)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent'
                   }}></i>
              </div>
              <h2 className="fw-bold mb-1" style={{color: 'var(--brand-dark)'}}>Admin Portal</h2>
              <p className="text-muted">Secure access to control center</p>
            </div>

            {/* Login Card */}
            <div className="card card-dark shadow-lg p-4">
              <div className="mb-3">
                <span className="badge badge-soft text-uppercase small">
                  <i className="bi bi-key-fill me-1"></i>
                  Restricted Access
                </span>
              </div>
              <h3 className="h4 mb-2">Sign in to Dashboard</h3>
              <p className="text-muted small mb-4">Enter your admin credentials to continue</p>
              
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="password">
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="btn btn-accent w-100" disabled={loading} type="submit">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Verifying credentials…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Access Dashboard
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-4 pt-3" style={{borderTop: '1px solid rgba(0,0,0,0.06)'}}>
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Protected by secure authentication
                </small>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <small className="text-muted">
                Need help? Contact system administrator
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
