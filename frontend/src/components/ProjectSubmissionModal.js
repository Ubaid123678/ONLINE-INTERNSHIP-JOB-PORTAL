import { useState } from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';
import api from '../services/api';

const ProjectSubmissionModal = ({ show, onHide, application, onSubmitted }) => {
  const [projectFile, setProjectFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        setProjectFile(null);
        return;
      }
      setProjectFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('projectFile', projectFile);
      formData.append('description', description);

      const response = await api.post(
        `/applications/${application._id}/submit-project`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (onSubmitted) {
        onSubmitted(response.data.application);
      }

      setProjectFile(null);
      setDescription('');
      setUploadProgress(0);
      onHide();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit project');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton closeVariant="white" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))' }}>
          <Modal.Title className="text-white">
            <i className="bi bi-cloud-upload me-2 text-white"></i>
            Submit Completed Project
          </Modal.Title>
        </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Important:</strong> You can only submit your project once. Make sure your work is complete before uploading.
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <i className="bi bi-file-earmark-zip me-2"></i>
              Project File
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".zip,.rar,.pdf,.doc,.docx,.ppt,.pptx"
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Accepted formats: ZIP, RAR, PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
            </Form.Text>
            {projectFile && (
              <div className="mt-3 p-3 bg-light rounded">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary fs-2">
                    <i className="bi bi-file-earmark-check-fill"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{projectFile.name}</div>
                    <small className="text-muted">{formatFileSize(projectFile.size)}</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setProjectFile(null)}
                    disabled={loading}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <i className="bi bi-chat-left-text me-2"></i>
              Project Description (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Describe your project, what you've accomplished, any notes for the client..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              {description.length}/1000 characters
            </Form.Text>
          </Form.Group>

          {loading && uploadProgress > 0 && (
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Uploading...</span>
                <span className="text-muted small">{uploadProgress}%</span>
              </div>
              <ProgressBar 
                now={uploadProgress} 
                variant="success"
                animated
                striped
              />
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !projectFile}
              style={{
                background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))',
                border: 'none',
                color: '#fff'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Submit Project
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectSubmissionModal;
