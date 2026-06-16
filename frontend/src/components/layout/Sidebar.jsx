import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { TransferApi } from '../../services/api.js';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Users, Building2, Package, Bell } from 'lucide-react';

const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.8rem 1rem',
  borderRadius: '8px',
  color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.65)',
  backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
  textDecoration: 'none',
  fontSize: '0.92rem',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.2s ease'
});

const ToastNotification = ({ show, onClose, onAction }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', borderLeft: '4px solid #E05A1E', zIndex: 9999, width: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'slideInRight 0.3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 'bold' }}>
        <Bell size={18} color="#E05A1E" />
        Nouvelle demande de transfert
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>Vous avez de nouveaux transferts en attente d'approbation.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button onClick={onClose} style={{ padding: '0.3rem 0.6rem', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>Ignorer</button>
        <button onClick={onAction} style={{ padding: '0.3rem 0.6rem', border: 'none', background: '#f1f5f9', color: '#E05A1E', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Voir</button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const prevCountRef = useRef(0);

  const isRole = (roles) => roles.includes(user?.role);

  useEffect(() => {
    let interval;
    const fetchPendingCount = async () => {
      if (user?.role === 'Admin Centre') {
        try {
          const res = await TransferApi.getPendingCount();
          if (res.success) {
            const currentCount = res.count;
            setPendingCount(currentCount);
            if (currentCount > prevCountRef.current && currentCount > 0) {
              setShowToast(true);
              setTimeout(() => setShowToast(false), 8000); // auto dismiss
            }
            prevCountRef.current = currentCount;
          }
        } catch (e) {
          console.error("Erreur polling pending count", e);
        }
      }
    };

    fetchPendingCount();
    if (user?.role === 'Admin Centre') {
      interval = setInterval(fetchPendingCount, 30000); // 30s polling
    }
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <ToastNotification 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        onAction={() => { setShowToast(false); navigate('/transfers'); }} 
      />
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
          
          {/* Dashboard pour tous les utilisateurs non-Admin */}
          {!isRole(['Admin', 'ADMIN']) && (
            <NavLink 
              to="/dashboard"
              style={({ isActive }) => navItemStyle(isActive)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><LayoutDashboard size={18} /> Tableau de Bord</div>
            </NavLink>
          )}

          {/* Dashboard spécifique Administrateur */}
          {isRole(['Admin', 'ADMIN']) && (
            <NavLink 
              to="/admin/dashboard"
              style={({ isActive }) => navItemStyle(isActive)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><LayoutDashboard size={18} /> Console Admin</div>
            </NavLink>
          )}

          {/* Liste des Transferts (Tous connectés) */}
          <NavLink 
            to="/transfers"
            end
            style={({ isActive }) => navItemStyle(isActive)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <ArrowLeftRight size={18} />
              Suivi Transferts
            </div>
            {pendingCount > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>
                {pendingCount}
              </span>
            )}
          </NavLink>

          {/* Nouveau Transfert — Règle 1 : caché pour Admin et Admin Centre */}
          {!isRole(['Admin', 'ADMIN', 'Admin Centre']) && (
            <NavLink 
              to="/transfers/new"
              style={({ isActive }) => navItemStyle(isActive)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><PlusCircle size={18} /> Nouveau Transfert</div>
            </NavLink>
          )}

          {/* Gestion Admin Global */}
          {isRole(['Admin', 'ADMIN']) && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gray-400)', paddingLeft: '1rem', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                Administration
              </span>
              <NavLink 
                to="/admin/users"
                style={({ isActive }) => navItemStyle(isActive)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Users size={18} /> Utilisateurs</div>
              </NavLink>
              <NavLink 
                to="/admin/centres"
                style={({ isActive }) => navItemStyle(isActive)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Building2 size={18} /> Centres</div>
              </NavLink>
              <NavLink 
                to="/admin/materiels"
                style={({ isActive }) => navItemStyle(isActive)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Package size={18} /> Matériels</div>
              </NavLink>
            </div>
          )}

          {/* Gestion Admin Centre — accès aux matériels de son centre */}
          {isRole(['Admin Centre']) && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gray-400)', paddingLeft: '1rem', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                Mon Centre
              </span>
              <NavLink 
                to="/admin/materiels"
                style={({ isActive }) => navItemStyle(isActive)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Package size={18} /> Mes Matériels</div>
              </NavLink>
            </div>
          )}

        </nav>

        {/* Footer Sidebar */}
        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          v1.0.0 © ENTP 2026
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
