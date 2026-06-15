import api from './api.js';

const authService = {
  /**
   * Se connecter à l'application
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { success, token, user }
  },

  /**
   * Se déconnecter de l'application
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Récupérer les données de l'utilisateur avec son Token
   */
  getCurrentUser: async (token) => {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.user;
  }
};

export default authService;
