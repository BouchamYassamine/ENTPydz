import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Users } from 'lucide-react';

const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.65)',
  backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
  textDecoration: 'none',
  fontSize: '0.92rem',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.2s ease'
});

const Sidebar = () => {
  const { user } = useAuth();

  const isRole = (roles) => roles.includes(user?.role);

  return (
    <aside 
      style={{
        width: '260px',
        height: '100vh',
        backgroundColor: 'var(--dark-color)',
        color: 'var(--white)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        flexShrink: 0
      }}
    >
      {/* Logo ENTP */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: 'var(--primary-color)' }}>
          ENTP
        </h1>
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '1px' }}>
          Travaux aux Puits
        </span>
      </div>

      {/* Menu principal */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
        
        {/* Dashboard pour Responsables et autres agents */}
        {isRole(['Responsable Service', 'Agent Logistique', 'Consultant']) && (
          <NavLink 
            to="/dashboard"
            style={({ isActive }) => navItemStyle(isActive)}
          >
            <LayoutDashboard size={18} />
            Tableau de Bord
          </NavLink>
        )}

        {/* Dashboard spécifique Administrateur */}
<<<<<<< HEAD
        {isRole(['Admin', 'ADMIN']) && (
=======
        {isRole(['Admin']) && (
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
          <NavLink 
            to="/admin/dashboard"
            style={({ isActive }) => navItemStyle(isActive)}
          >
            <LayoutDashboard size={18} />
            Console Admin
          </NavLink>
        )}

        {/* Liste des Transferts (Tous connectés) */}
        <NavLink 
          to="/transfers"
          end
          style={({ isActive }) => navItemStyle(isActive)}
        >
          <ArrowLeftRight size={18} />
          Suivi Transferts
        </NavLink>

        {/* Faire une demande de transfert (Admin & Responsable) */}
<<<<<<< HEAD
        {isRole(['Admin', 'ADMIN', 'Responsable Service']) && (
=======
        {isRole(['Admin', 'Responsable Service']) && (
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
          <NavLink 
            to="/transfers/new"
            style={({ isActive }) => navItemStyle(isActive)}
          >
            <PlusCircle size={18} />
            Nouveau Transfert
          </NavLink>
        )}

        {/* Gestion des utilisateurs (Admin uniquement) */}
<<<<<<< HEAD
        {isRole(['Admin', 'ADMIN']) && (
=======
        {isRole(['Admin']) && (
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gray-400)', paddingLeft: '1rem', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>
              Administration
            </span>
            <NavLink 
              to="/admin/users"
              style={({ isActive }) => navItemStyle(isActive)}
            >
              <Users size={18} />
              Utilisateurs
            </NavLink>
          </div>
        )}

      </nav>

      {/* Footer Sidebar */}
      <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        v1.0.0 © ENTP 2026
      </div>
    </aside>
  );
};

export default Sidebar;
