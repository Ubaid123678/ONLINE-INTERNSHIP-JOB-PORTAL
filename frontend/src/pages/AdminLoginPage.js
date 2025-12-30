import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { login, loading, logout } = useAuth();
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
      const { user } = await login(form);
      if (user?.role !== 'admin') {
        logout({ redirect: false });
        setError('Only verified admin accounts can sign in here.');
        return;
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <p className="text-uppercase text-muted small fw-semibold mb-1">Admin Console</p>
              <h2 className="mb-3 fw-semibold">Sign in as administrator</h2>
              <p className="text-muted">
                This area is restricted to the platform administrator. Regular users should
                continue to the standard <Link to="/login">login page</Link>.
              </p>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Admin email
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
                <button disabled={loading} className="btn btn-dark w-100" type="submit">
                  {loading ? 'Verifying…' : 'Access admin dashboard'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
