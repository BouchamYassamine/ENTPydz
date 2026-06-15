import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restaurer la session utilisateur au chargement de l'application
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Appel API pour récupérer le profil actuel de l'utilisateur
          const userData = await authService.getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Session expirée ou invalide :', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  /**
   * Action de connexion utilisateur
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      // Stockage du token et de l'utilisateur
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);

      // Redirection intelligente en fonction du rôle
      if (response.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

      return { success: true };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Identifiants ou connexion impossibles.'
      };
    }
  };

  /**
   * Action de déconnexion
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
