import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import api, { extractErrorMessage } from '../services/api';

const STORAGE_TOKEN_KEY = 'admin_portal_token';
const STORAGE_USER_KEY = 'admin_portal_user';

const AuthContext = createContext(null);

const persistAuth = (token, user) => {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = (payload) => {
    const { token: nextToken, user: nextUser } = payload;
    setUser(nextUser);
    setToken(nextToken);
    persistAuth(nextToken, nextUser);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', credentials);
      if (data.user?.role !== 'admin') {
        throw new Error('Only admin accounts can access this console.');
      }
      handleSuccess(data);
      return data.user;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout, isAuthenticated: Boolean(user) }),
    [user, token, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
