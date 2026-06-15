import React from 'react';

/**
 * Modale réutilisable pour les confirmations ou les formulaires rapides
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(29, 39, 49, 0.5)', // Backdrop
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()} // Évite de fermer au clic sur le contenu
      >
        {/* Header de la modale */}
        <div 
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-color)' }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              fontSize: '1.5rem',
              color: 'var(--gray-400)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>

        {/* Corps de la modale */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
