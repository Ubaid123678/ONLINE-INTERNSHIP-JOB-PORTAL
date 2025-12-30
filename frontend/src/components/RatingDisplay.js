import { useEffect, useState } from 'react';
import api from '../services/api';

const RatingDisplay = ({ userId, showReviews = true }) => {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/ratings/user/${userId}`);
      setRatingsData(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          color: star <= rating ? '#ffc107' : '#e0e0e0',
          fontSize: '1.2rem',
          marginRight: '2px'
        }}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="text-muted">Loading ratings...</div>;
  }

  if (!ratingsData) {
    return null;
  }

  const { stats, ratings } = ratingsData;

  return (
    <div className="rating-display">
      <div className="rating-summary mb-4 p-4 rounded" style={{
        background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(0, 200, 150, 0.05) 100%)',
        border: '1px solid rgba(13, 110, 253, 0.15)'
      }}>
        <div className="d-flex align-items-center gap-3">
          <div className="text-center">
            <div className="display-4 fw-bold mb-0" style={{
              background: 'linear-gradient(120deg, #0d6efd, #00c896)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="mb-2">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <small className="text-muted">
              {stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'}
            </small>
          </div>
          <div className="flex-grow-1">
            <div className="mb-2">
              <small className="text-muted">Rating Distribution</small>
            </div>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter(r => Math.round(r.rating) === star).length;
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              return (
                <div key={star} className="d-flex align-items-center mb-1">
                  <span className="me-2" style={{ width: '20px' }}>{star}★</span>
                  <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ 
                        width: `${percentage}%`,
                        background: 'linear-gradient(120deg, #0d6efd, #00c896)'
                      }}
                      aria-valuenow={percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted" style={{ width: '40px' }}>{count}</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showReviews && ratings.length > 0 && (
        <div className="reviews-list">
          <h5 className="mb-3">Reviews</h5>
          {ratings.map((rating) => (
            <div key={rating._id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <div>
                    {rating.ratedBy.profile?.profilePicture ? (
                      <img
                        src={`http://localhost:5000${rating.ratedBy.profile.profilePicture}`}
                        alt={rating.ratedBy.name}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{ width: '50px', height: '50px' }}
                      >
                        {rating.ratedBy.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-0">{rating.ratedBy.name}</h6>
                        <small className="text-muted">
                          {rating.ratedBy.role === 'client' && rating.ratedBy.profile?.company && 
                            `${rating.ratedBy.profile.company} • `}
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div>
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    {rating.review && (
                      <p className="mb-2">{rating.review}</p>
                    )}
                    {rating.relatedJob && (
                      <small className="text-muted">
                        <i className="bi bi-briefcase me-1"></i>
                        Related to: {rating.relatedJob.title}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stats.totalRatings === 0 && (
        <div className="text-center text-muted py-4">
          <i className="bi bi-star fs-1 d-block mb-2"></i>
          <p>No ratings yet</p>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
