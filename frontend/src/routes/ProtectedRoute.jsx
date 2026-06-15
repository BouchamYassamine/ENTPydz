import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Garde de sécurité pour les routes protégées
 * @param {ReactNode} children - Composant/Page à afficher si autorisé
 * @param {Array<string>} allowedRoles - Liste optionnelle des rôles autorisés à accéder à cette route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Chargement de votre session ENTP...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, redirection vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles spécifiques sont requis pour la route et que l'utilisateur n'a pas les droits
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirection vers le dashboard adapté si non autorisé
    return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
