import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_portal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const extractErrorMessage = (error) => {
  if (error.response?.data?.msg) return error.response.data.msg;
  if (error.message) return error.message;
  return 'Unexpected error. Please try again.';
};

export default api;
