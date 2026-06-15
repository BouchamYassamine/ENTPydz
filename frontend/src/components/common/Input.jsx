import React from 'react';

/**
 * Champ de saisie réutilisable
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {label && (
        <label 
          htmlFor={name}
          style={{
            marginBottom: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--gray-600)'
          }}
        >
          {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '0.7rem 0.9rem',
          borderRadius: 'var(--border-radius)',
          border: error ? '1px solid var(--danger-color)' : '1px solid var(--gray-200)',
          fontSize: '0.95rem',
          backgroundColor: 'var(--white)',
          transition: 'border-color 0.2s',
          width: '100%'
        }}
      />
      {error && (
        <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
