import axios from 'axios';
import config from '../config.js';

// Création d'une instance Axios configurée
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le jeton d'authentification (Bearer JWT)
api.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
