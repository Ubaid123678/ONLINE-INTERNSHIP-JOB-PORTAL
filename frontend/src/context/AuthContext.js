import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../services/api';
import socketService from '../services/socketService';

const AuthContext = createContext(null);

const persistAuth = (token, user) => {
  localStorage.setItem('portal_token', token);
  localStorage.setItem('portal_user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('portal_token');
  localStorage.removeItem('portal_user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('portal_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Connect socket when user is authenticated
  useEffect(() => {
    if (token && user) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
  }, [token, user]);

  const handleSuccess = useCallback((payload) => {
    const { token: nextToken, user: nextUser } = payload;
    setUser(nextUser);
    setToken(nextToken);
    persistAuth(nextToken, nextUser);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', credentials);
      handleSuccess(data);
      return data;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [handleSuccess]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', payload);
      handleSuccess(data);
      return data;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [handleSuccess]);

  const logout = useCallback((options = {}) => {
    const { redirect = true } = options;
    socketService.disconnect();
    clearAuth();
    setUser(null);
    setToken(null);
    if (redirect) {
      navigate('/');
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      isStudent: user?.role === 'student',
      isRecruiter: user?.role === 'client',
      isAdmin: user?.role === 'admin'
    }),
    [user, token, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
