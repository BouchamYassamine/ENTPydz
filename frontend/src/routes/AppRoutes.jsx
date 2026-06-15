import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login/Login.jsx';
import AdminDashboard from '../pages/Dashboard/AdminDashboard.jsx';
<<<<<<< HEAD
import Users from '../pages/Admin/Users.jsx';
=======
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
import ManagerDashboard from '../pages/Dashboard/ManagerDashboard.jsx';
import TransferList from '../pages/Transfers/TransferList.jsx';
import TransferDetail from '../pages/Transfers/TransferDetail.jsx';
import NewTransfer from '../pages/Transfers/NewTransfer.jsx';
import NotFound from '../pages/NotFound.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées (Exigent d'être connecté) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        
        {/* Pages accessibles par tout utilisateur connecté */}
        <Route path="/transfers" element={<TransferList />} />
        <Route path="/transfers/:id" element={<TransferDetail />} />

        {/* Dashboard générique pour tous les utilisateurs non-Admin */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Responsable Service', 'Agent Logistique', 'Consultant']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard spécifique Administrateur */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

<<<<<<< HEAD
        {/* Gestion des utilisateurs (uniquement Admin) */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'ADMIN']}>
              <Users />
            </ProtectedRoute>
          } 
        />

<<<<<<< Updated upstream
=======
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
        {/* Création de transferts (uniquement Admin et Responsables) */}
=======
        {/* Création de transferts — Règle 1 : interdit pour Admin */}
>>>>>>> Stashed changes
        <Route 
          path="/transfers/new" 
          element={
            <ProtectedRoute allowedRoles={['Responsable Service', 'Agent Logistique', 'Consultant']}>
              <NewTransfer />
            </ProtectedRoute>
          } 
        />

      </Route>

      {/* Redirection automatique depuis la racine */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Erreur 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
