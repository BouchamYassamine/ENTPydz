import React from 'react';
import useAuth from '../../hooks/useAuth.js';
import { LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header 
      style={{
        height: '60px',
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-color)' }}>
        Gestion de Transfert de Matériel
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Infos Utilisateur */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderRight: '1px solid var(--gray-200)', paddingRight: '1.5rem' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 2px 8px rgba(232, 97, 26, 0.25)'
              }}
            >
              <UserIcon size={17} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--dark-color)' }}>{user.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>
                {user.role} • {user.service}
              </span>
            </div>
          </div>
        )}

        {/* Bouton déconnexion */}
        <button 
          onClick={logout}
          style={{
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--danger-color)',
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: 'opacity 0.2s'
          }}
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
