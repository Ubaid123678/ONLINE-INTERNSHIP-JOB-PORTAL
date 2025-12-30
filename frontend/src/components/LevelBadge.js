import React from 'react';

const LevelBadge = ({ level, levelNumber, size = 'medium', showProgress = false, progress = 0 }) => {
  const getLevelColor = (levelName) => {
    const colors = {
      'Bronze': '#CD7F32',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Platinum': '#E5E4E2',
      'Diamond': '#B9F2FF',
      'Master': '#FF1493'
    };
    return colors[levelName] || '#CD7F32';
  };

  const sizes = {
    small: {
      container: '40px',
      fontSize: '0.7rem',
      numSize: '1rem'
    },
    medium: {
      container: '60px',
      fontSize: '0.8rem',
      numSize: '1.3rem'
    },
    large: {
      container: '80px',
      fontSize: '0.9rem',
      numSize: '1.6rem'
    }
  };

  const sizeConfig = sizes[size] || sizes.medium;
  const color = getLevelColor(level);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div
        style={{
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: level === 'Silver' || level === 'Platinum' ? '#333' : '#fff',
          fontWeight: 'bold',
          boxShadow: `0 4px 12px ${color}66`,
          border: `3px solid ${color}`,
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <div style={{ fontSize: sizeConfig.numSize, lineHeight: 1 }}>
          {levelNumber}
        </div>
        <div style={{ fontSize: sizeConfig.fontSize, lineHeight: 1, marginTop: '2px' }}>
          {level}
        </div>
        
        {showProgress && (
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120%',
              height: '6px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: color,
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelBadge;
