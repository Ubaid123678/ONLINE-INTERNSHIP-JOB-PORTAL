import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuth } from './context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <AdminDashboardPage />;
};

const App = () => (
  <div className="admin-app">
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/dashboard" element={<AdminRoute />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </div>
);

export default App;
