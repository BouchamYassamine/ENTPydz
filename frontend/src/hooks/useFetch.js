import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

/**
 * Hook personnalisé pour simplifier les requêtes GET HTTP
 * @param {string} url - Point d'accès de l'API
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data.data || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
