import axios from 'axios';
<<<<<<< HEAD

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL du backend Express
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT s'il existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TransferApi = {
  /**
   * Récupère la liste des catégories avec leurs matériels
   */
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  /**
   * Récupère les matériels avec filtres optionnels
   * @param {Object} params - { categorieId, search }
   */
  getMateriels: async (params = {}) => {
    const response = await apiClient.get('/materiels', { params });
    return response.data;
  },

  /**
   * Crée une nouvelle demande de transfert
   * @param {Object} transferData - Données du transfert
   */
  createTransfert: async (transferData) => {
    const response = await apiClient.post('/transferts', transferData);
    return response.data;
  },

  /**
   * Récupère les transferts envoyés par un centre
   * @param {number} centreId 
   */
  getTransfertsEnvoyes: async (centreId) => {
    const response = await apiClient.get(`/transferts/envoyes/${centreId}`);
    return response.data;
  },

  /**
   * Récupère les transferts reçus par un centre
   * @param {number} centreId 
   */
  getTransfertsRecus: async (centreId) => {
    const response = await apiClient.get(`/transferts/recus/${centreId}`);
    return response.data;
  },

  /**
   * Valide la réception d'un transfert
   * @param {number} transfertId 
   */
  receptionnerTransfert: async (transfertId) => {
    const response = await apiClient.patch(`/transferts/${transfertId}/receptionner`);
    return response.data;
  }
};

export const UserApi = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};

export default apiClient;
=======
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
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
