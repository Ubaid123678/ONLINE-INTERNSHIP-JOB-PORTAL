import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LevelBadge from './LevelBadge';

const AchievementsCard = ({ userId, showFullDetails = false }) => {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevelData();
  }, [userId]);

  const fetchLevelData = async () => {
    try {
      const response = await api.get(`/ratings/level/${userId}`);
      setLevelData(response.data);
    } catch (error) {
      console.error('Error fetching level data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-4">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!levelData) {
    return null;
  }

  const getBadgeIcon = (iconName) => {
    const icons = {
      'star': '⭐',
      'award': '🏆',
      'trophy': '🥇',
      'shield': '🛡️',
      'crown': '👑',
      'trending-up': '📈'
    };
    return icons[iconName] || '🏅';
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Level & Achievements</h6>
        
        <div className="text-center mb-3">
          <LevelBadge 
            level={levelData.levelName} 
            levelNumber={levelData.levelNumber}
            size="large"
            showProgress={true}
            progress={levelData.progress}
          />
          
          <div className="mt-3">
            <div className="small text-muted mb-1">
              {levelData.currentPoints} / {levelData.currentPoints + levelData.pointsToNextLevel} points
            </div>
            {levelData.pointsToNextLevel > 0 && (
              <div className="small text-muted">
                {levelData.pointsToNextLevel} points to {levelData.nextLevelName}
              </div>
            )}
          </div>
        </div>

        {showFullDetails && (
          <>
            <hr />
            
            {/* Badges */}
            {levelData.badges && levelData.badges.length > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="fw-semibold text-muted">BADGES EARNED</small>
                  <span className="badge bg-primary rounded-pill">{levelData.badges.length}</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {levelData.badges.slice(0, 6).map((badge, index) => (
                    <div
                      key={index}
                      className="badge bg-light text-dark p-2"
                      style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                      title={badge.description}
                    >
                      {getBadgeIcon(badge.icon)} {badge.name}
                    </div>
                  ))}
                  {levelData.badges.length > 6 && (
                    <div className="badge bg-secondary p-2" style={{ fontSize: '0.85rem' }}>
                      +{levelData.badges.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="row g-2">
              <div className="col-6">
                <div className="card bg-light border-0">
                  <div className="card-body p-2 text-center">
                    <div className="h4 mb-0 fw-bold text-primary">{levelData.currentPoints}</div>
                    <small className="text-muted">Total Points</small>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-light border-0">
                  <div className="card-body p-2 text-center">
                    <div className="h4 mb-0 fw-bold text-success">{levelData.badges?.length || 0}</div>
                    <small className="text-muted">Badges</small>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementsCard;
