import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const AppNavbar = () => {
  const { user, logout, isRecruiter } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="url(#gradient)"/>
            <path d="M18 9L24 15H21V21H15V15H12L18 9Z" fill="white"/>
            <path d="M12 24H24V27H12V24Z" fill="white"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00c896"/>
                <stop offset="1" stopColor="#0d6efd"/>
              </linearGradient>
            </defs>
          </svg>
          <span>INTERNSHIP+</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/jobs">
                    Jobs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                {isRecruiter && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/my-jobs">
                        My Jobs
                      </NavLink>
                    </li>
                  </>
                )}
                
                {/* Notification Bell */}
                <li className="nav-item">
                  <NotificationBell />
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="btn dropdown-toggle d-flex align-items-center gap-2 text-light"
                    id="userMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ padding: '0.35rem 0.75rem', border: 'none', background: 'transparent' }}
                  >
                    {user?.profile?.profilePicture ? (
                      <img
                        src={user.profile.profilePicture.startsWith('http') ? user.profile.profilePicture : `http://localhost:5000/${user.profile.profilePicture}`}
                        alt="Profile"
                        className="rounded-circle border border-2 border-light"
                        style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                        style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}
                      >
                        {user?.name ? user.name.substring(0, 2).toUpperCase() : '?'}
                      </span>
                    )}
                    <span className="d-none d-sm-inline">
                      {user?.name || 'User'}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userMenuButton">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wallet">
                        <i className="bi bi-wallet2 me-2"></i>
                        My Wallet
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/jobs">
                    Jobs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">
                    About Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/contact">
                    Contact Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm ms-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-accent btn-sm ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
