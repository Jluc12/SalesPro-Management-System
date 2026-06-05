import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('srms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('srms_token');
      localStorage.removeItem('srms_user');
      window.location.href = '/login';
    }
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out');
    }
    return Promise.reject(error);
  }
);

export default API;
