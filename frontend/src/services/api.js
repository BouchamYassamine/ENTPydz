import axios from 'axios';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const TransferApi = {
  getTransfers: async () => { const r = await apiClient.get('/transfers'); return r.data; },
  createTransfert: async (data) => { const r = await apiClient.post('/transfers', data); return r.data; },
  getTransfertsEnvoyes: async (centreId) => { const r = await apiClient.get(`/transfers/envoyes/${centreId}`); return r.data; },
  getTransfertsRecus: async (centreId) => { const r = await apiClient.get(`/transfers/recus/${centreId}`); return r.data; },
  validateTransfert: async (id, data) => { const r = await apiClient.patch(`/transfers/${id}/validate`, data); return r.data; },
  receptionnerTransfert: async (id) => { const r = await apiClient.patch(`/transfers/${id}/receive`); return r.data; },
  getPendingCount: async () => { const r = await apiClient.get('/transfers/pending-count'); return r.data; }
};

export const UserApi = {
  getUsers: async () => { const r = await apiClient.get('/users'); return r.data; },
  getUserById: async (id) => { const r = await apiClient.get(`/users/${id}`); return r.data; },
  createUser: async (data) => { const r = await apiClient.post('/users', data); return r.data; },
  updateUser: async (id, data) => { const r = await apiClient.put(`/users/${id}`, data); return r.data; },
  deleteUser: async (id) => { const r = await apiClient.delete(`/users/${id}`); return r.data; }
};

export const CentreApi = {
  getCentres: async () => { const r = await apiClient.get('/centres'); return r.data; },
  getCentreById: async (id) => { const r = await apiClient.get(`/centres/${id}`); return r.data; },
  createCentre: async (data) => { const r = await apiClient.post('/centres', data); return r.data; },
  updateCentre: async (id, data) => { const r = await apiClient.put(`/centres/${id}`, data); return r.data; },
  deleteCentre: async (id) => { const r = await apiClient.delete(`/centres/${id}`); return r.data; }
};

export const MaterielApi = {
  getMateriels: async (params = {}) => { const r = await apiClient.get('/materials', { params }); return r.data; },
  getMaterielById: async (id) => { const r = await apiClient.get(`/materials/${id}`); return r.data; },
  createMateriel: async (data) => { const r = await apiClient.post('/materials', data); return r.data; },
  updateMateriel: async (id, data) => { const r = await apiClient.put(`/materials/${id}`, data); return r.data; },
  deleteMateriel: async (id) => { const r = await apiClient.delete(`/materials/${id}`); return r.data; }
};

export const CategorieApi = {
  getCategories: async () => { const r = await apiClient.get('/categories'); return r.data; },
  createCategorie: async (data) => { const r = await apiClient.post('/categories', data); return r.data; },
  updateCategorie: async (id, data) => { const r = await apiClient.put(`/categories/${id}`, data); return r.data; },
  deleteCategorie: async (id) => { const r = await apiClient.delete(`/categories/${id}`); return r.data; }
};

export default apiClient;
