import React from 'react';

const UrgencySelector = ({ urgency, onChange }) => {
  const options = [
    { value: 'Normal',   dotClass: 'bg-green-500',  dot: '#10B981' },
    { value: 'Urgent',   dotClass: 'bg-yellow-500', dot: '#F59E0B' },
    { value: 'Critique', dotClass: 'bg-red-500',    dot: '#EF4444' },
  ];

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
        Niveau d'urgence <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {options.map(({ value, dot }) => {
          const isSelected = urgency === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? '#E05A1E' : '#E5E7EB'}`,
                backgroundColor: isSelected ? '#FDF2ED' : '#fff',
                color: isSelected ? '#C94D18' : '#4B5563',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseOut={(e)  => { if (!isSelected) e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: dot,
                flexShrink: 0,
              }} />
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UrgencySelector;
