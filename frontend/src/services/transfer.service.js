import api from './api.js';

const transferService = {
  /**
   * Lister toutes les demandes de transfert
   */
  getTransfers: async () => {
    const response = await api.get('/transfers');
    return response.data.data;
  },

  /**
   * Créer un nouveau transfert de matériel
   */
  createTransfer: async (transferData) => {
    const response = await api.post('/transfers', transferData);
    return response.data;
  },

  /**
   * Modifier le statut d'un transfert (Validation / Refus)
   */
  updateStatus: async (id, status, comments) => {
    const response = await api.put(`/transfers/${id}/status`, { status, comments });
    return response.data;
  }
};

export default transferService;
