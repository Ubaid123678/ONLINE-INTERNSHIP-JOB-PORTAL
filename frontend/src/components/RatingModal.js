import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const RatingModal = ({ show, onHide, ratedUser, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/ratings', {
        ratedUserId: ratedUser._id,
        rating,
        review: review.trim()
      });

      if (onRatingSubmitted) {
        onRatingSubmitted(response.data);
      }

      setRating(0);
      setReview('');
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        style={{
          fontSize: '2.5rem',
          cursor: 'pointer',
          color: star <= (hoveredRating || rating) ? '#ffc107' : '#e0e0e0',
          transition: 'color 0.2s ease',
          marginRight: '0.5rem'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Rate {ratedUser?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <p className="text-muted mb-3">How would you rate your experience?</p>
            <div className="d-flex justify-content-center">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="mt-2 mb-0">
                <strong>{rating}</strong> out of 5 stars
              </p>
            )}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Review (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Share your experience working with this person..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {review.length}/500 characters
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RatingModal;
