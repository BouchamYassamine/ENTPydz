import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login/Login.jsx';
import AdminDashboard from '../pages/Dashboard/AdminDashboard.jsx';
import Users from '../pages/Admin/Users.jsx';
import Centres from '../pages/Admin/Centres.jsx';
import Materiels from '../pages/Admin/Materiels.jsx';
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

        {/* Dashboard générique — Admin Centre et Utilisateur */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Admin Centre', 'Utilisateur']}>
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

        {/* Gestion des utilisateurs (uniquement Admin) */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'ADMIN']}>
              <Users />
            </ProtectedRoute>
          } 
        />

        {/* Gestion des centres (uniquement Admin) */}
        <Route 
          path="/admin/centres" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'ADMIN']}>
              <Centres />
            </ProtectedRoute>
          } 
        />

        {/* Gestion des matériels — Admin global complet, Admin Centre peut gérer son centre */}
        <Route 
          path="/admin/materiels" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Admin Centre']}>
              <Materiels />
            </ProtectedRoute>
          } 
        />

        {/* Création de transferts — Utilisateur uniquement */}
        <Route 
          path="/transfers/new" 
          element={
            <ProtectedRoute allowedRoles={['Utilisateur']}>
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
