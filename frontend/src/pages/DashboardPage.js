import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, isStudent, isRecruiter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isStudent) {
        navigate('/student-dashboard', { replace: true });
      } else if (isRecruiter) {
        navigate('/client-dashboard', { replace: true });
      }
    }
  }, [user, isStudent, isRecruiter, navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-3">Redirecting to your dashboard...</p>
    </div>
  );
};

export default DashboardPage;
