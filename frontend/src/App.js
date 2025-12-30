import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import MyJobsPage from './pages/MyJobsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import ClientDashboard from './pages/ClientDashboard';
import StudentDashboard from './pages/StudentDashboard';
import JobApplicationsPage from './pages/JobApplicationsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);
  const hideFooter = ['/login', '/register'].includes(location.pathname) || user;

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && <AppNavbar />}
      <main className="app-main" style={{ flex: '1' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['client']} />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/my-jobs" element={<MyJobsPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/edit-job/:jobId" element={<EditJobPage />} />
            <Route path="/jobs/:jobId/applications" element={<JobApplicationsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
