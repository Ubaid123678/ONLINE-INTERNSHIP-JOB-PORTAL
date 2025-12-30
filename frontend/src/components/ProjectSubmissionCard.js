import { useState, useEffect } from 'react';
import api from '../services/api';
import RatingModal from './RatingModal';

const ProjectSubmissionCard = ({ application, isStudent, onRatingUpdate }) => {
  const { projectSubmission } = application;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [currentRating, setCurrentRating] = useState(null);
  const [studentRatingStats, setStudentRatingStats] = useState(null);

  useEffect(() => {
    if (!isStudent && application.student?._id) {
      checkExistingRating();
      fetchStudentRating();
    }
  }, [application.student?._id, isStudent]);

  const checkExistingRating = async () => {
    try {
      const { data } = await api.get(`/ratings/check/${application.student._id}`);
      setHasRated(data.hasRated);
      setCurrentRating(data.rating);
    } catch (error) {
      console.error('Failed to check rating:', error);
    }
  };

  const fetchStudentRating = async () => {
    try {
      const { data } = await api.get(`/ratings/user/${application.student._id}`);
      setStudentRatingStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch student rating:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/applications/${application._id}/download-project`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', projectSubmission.fileName || 'project-file');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to download project');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRatingSubmitted = (data) => {
    setHasRated(true);
    setCurrentRating(data.rating);
    setStudentRatingStats(data.updatedStats);
    setShowRatingModal(false);
    if (onRatingUpdate) {
      onRatingUpdate(data);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#ffc107' : '#e0e0e0',
            fontSize: '1rem'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (!projectSubmission?.isSubmitted) {
    return null;
  }

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <h6 className="fw-bold mb-0">
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            Project Submitted
          </h6>
          <span className="badge bg-success">
            <i className="bi bi-clock-history me-1"></i>
            Completed
          </span>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
            <div className="text-primary fs-2">
              <i className="bi bi-file-earmark-zip-fill"></i>
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{projectSubmission.fileName}</div>
              <small className="text-muted">
                {formatFileSize(projectSubmission.fileSize)} • 
                Submitted {formatDate(projectSubmission.submittedAt)}
              </small>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleDownload}
            >
              <i className="bi bi-download me-2"></i>
              Download
            </button>
          </div>
        </div>

        {projectSubmission.description && (
          <div className="mb-2">
            <label className="form-label fw-semibold small text-muted text-uppercase">
              <i className="bi bi-chat-left-text me-2"></i>
              Project Description
            </label>
            <div className="p-3 bg-light rounded">
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {projectSubmission.description}
              </p>
            </div>
          </div>
        )}

        {isStudent && (
          <div className="alert alert-info mb-0 mt-3">
            <i className="bi bi-info-circle me-2"></i>
            <small>
              Your project has been submitted successfully. The client can now review and download your work.
            </small>
          </div>
        )}

        {!isStudent && (
          <>
            <div className="alert alert-success mb-3">
              <i className="bi bi-check-circle me-2"></i>
              <small>
                The student has completed and submitted their project. You can download and review the work above.
              </small>
            </div>

            {/* Rating Section for Client */}
            <div className="card bg-light border-0 mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Rate Student Performance
                  </h6>
                  {studentRatingStats && (
                    <div className="text-end">
                      <div className="fw-bold">
                        {renderStars(Math.round(studentRatingStats.averageRating))}
                        <span className="ms-2">{studentRatingStats.averageRating.toFixed(1)}</span>
                      </div>
                      <small className="text-muted">
                        {studentRatingStats.totalRatings} rating{studentRatingStats.totalRatings !== 1 ? 's' : ''}
                      </small>
                    </div>
                  )}
                </div>
                
                {hasRated ? (
                  <div className="alert alert-info mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>You rated this student: </strong>
                        {renderStars(currentRating?.rating || 0)}
                        <span className="ms-2">({currentRating?.rating || 0}/5)</span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setShowRatingModal(true)}
                      >
                        Update Rating
                      </button>
                    </div>
                    {currentRating?.review && (
                      <div className="mt-2 pt-2 border-top">
                        <small className="text-muted d-block mb-1">Your Review:</small>
                        <small>{currentRating.review}</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted small mb-2">
                      Help others by rating this student's work quality and professionalism. 
                      Your rating will enhance their profile value.
                    </p>
                    <button
                      className="btn btn-warning w-100"
                      onClick={() => setShowRatingModal(true)}
                    >
                      <i className="bi bi-star-fill me-2"></i>
                      Rate This Student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rating Modal */}
      {!isStudent && application.student && (
        <RatingModal
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          ratedUser={application.student}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default ProjectSubmissionCard;
