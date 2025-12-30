import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LevelBadge from './LevelBadge';

const Leaderboard = ({ role = null, limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(role || 'all');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedRole]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = {
        limit,
        ...(selectedRole !== 'all' && { role: selectedRole })
      };
      const response = await api.get('/ratings/leaderboard', { params });
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">🏆 Top Performers</h5>
          {!role && (
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${selectedRole === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedRole('all')}
              >
                All
              </button>
              <button
                className={`btn ${selectedRole === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedRole('student')}
              >
                Students
              </button>
              <button
                className={`btn ${selectedRole === 'client' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedRole('client')}
              >
                Clients
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No data available</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className="list-group-item"
                style={{
                  background: index < 3 
                    ? `linear-gradient(90deg, ${index === 0 ? '#fff9e6' : index === 1 ? '#f5f5f5' : '#fff5e6'}, #ffffff)`
                    : 'white'
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  {/* Rank */}
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: index < 3 ? '1.5rem' : '1.2rem',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}
                  >
                    {getMedalIcon(index)}
                  </div>

                  {/* Profile Picture */}
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:5000/${user.profilePicture}`}
                      alt={user.name}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ddd'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <Link
                        to={`/profile/${user.id}`}
                        className="fw-semibold text-decoration-none text-dark"
                      >
                        {user.name}
                      </Link>
                      <span className="badge bg-light text-dark text-capitalize small">
                        {user.role}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-1">
                      <small className="text-muted">
                        ⭐ {user.averageRating.toFixed(1)} ({user.totalRatings} ratings)
                      </small>
                      <small className="text-muted">
                        🏅 {user.badges} badges
                      </small>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="text-end">
                    <LevelBadge
                      level={user.level}
                      levelNumber={user.levelNumber}
                      size="small"
                    />
                    <div className="small text-muted mt-1">
                      {user.totalPoints} pts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
