import React from 'react';

/**
 * Bouton réutilisable personnalisé
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success'
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
      style={{
        padding: '0.6rem 1.2rem',
        borderRadius: 'var(--border-radius)',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        backgroundColor: variant === 'primary' ? 'var(--primary-color)' : 
                         variant === 'secondary' ? 'var(--secondary-color)' : 
                         variant === 'danger' ? 'var(--danger-color)' : 'var(--success-color)',
        color: variant === 'secondary' ? 'var(--dark-color)' : 'var(--white)',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      {children}
    </button>
  );
};

export default Button;
