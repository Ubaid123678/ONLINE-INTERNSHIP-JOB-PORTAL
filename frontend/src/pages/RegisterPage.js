import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: '' });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, message: '', color: '' };

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Determine strength
    if (score <= 2) return { score: 1, message: 'Weak', color: 'danger' };
    if (score <= 4) return { score: 2, message: 'Medium', color: 'warning' };
    return { score: 3, message: 'Strong', color: 'success' };
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = form;
      await register(registerData);
      navigate('/');
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
            <h1 className="display-5 fw-bold mb-4">Welcome to Internship+ Portal</h1>
            <p className="mb-4">Connect with opportunities and grow your career with our comprehensive platform.</p>
            
            <div className="mb-3">
              <h5 className="fw-semibold">🎓 For Students</h5>
              <p className="small opacity-90">Find internships and entry-level positions tailored to your skills.</p>
            </div>
            
            <div className="mb-3">
              <h5 className="fw-semibold">💼 For Clients</h5>
              <p className="small opacity-90">Post opportunities and connect with talented students.</p>
            </div>
            
            <div>
              <h5 className="fw-semibold">🚀 Easy to Use</h5>
              <p className="small opacity-90">Intuitive interface designed to streamline your journey.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="col-lg-5 d-flex flex-column align-items-center justify-content-center p-5 bg-white">
          <div className="mb-4" style={{ maxWidth: '380px', width: '100%' }}>
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted">Join our platform today</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ maxWidth: '380px', width: '100%' }}>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: '380px', width: '100%' }}>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="reg-email">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="role">
                  Register As <span className="text-danger">*</span>
                </label>
                <select 
                  id="role" 
                  name="role" 
                  className="form-select" 
                  value={form.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student - Looking for opportunities</option>
                  <option value="client">Client - Posting opportunities</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                {form.password && (
                  <div className="mt-2">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <small className="text-muted">Strength:</small>
                      <small className={`fw-semibold text-${passwordStrength.color}`}>
                        {passwordStrength.message}
                      </small>
                    </div>
                    <div className="progress" style={{ height: '3px' }}>
                      <div
                        className={`progress-bar bg-${passwordStrength.color}`}
                        role="progressbar"
                        style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                        aria-valuenow={passwordStrength.score}
                        aria-valuemin="0"
                        aria-valuemax="3"
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <small className="text-danger">Passwords do not match</small>
                )}
              </div>

              <button 
                className="btn btn-accent w-100 mb-3" 
                type="submit" 
                disabled={loading || (form.password && form.confirmPassword && form.password !== form.confirmPassword)}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-muted mb-0" style={{ maxWidth: '380px', width: '100%' }}>
              Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
