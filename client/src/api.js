import axios from 'axios';
const API = axios.create({ baseURL: 'https://oralvis1-1.onrender.com/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('oralvis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
