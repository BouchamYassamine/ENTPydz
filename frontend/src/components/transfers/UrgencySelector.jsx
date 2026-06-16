import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const UrgencySelector = ({ urgency, onChange }) => {
  const options = [
    { value: 'Normal',   icon: CheckCircle,   color: '#10B981', bg: '#ECFDF5', border: '#34D399', desc: 'Délai standard 5-7 jours' },
    { value: 'Urgent',   icon: Clock,         color: '#F59E0B', bg: '#FFFBEB', border: '#FBBF24', desc: 'Traitement prioritaire 24-48h' },
    { value: 'Critique', icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', border: '#F87171', desc: 'Arrêt de production - traitement immédiat' },
  ];

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.875rem', fontWeight: '600', color: '#2C3E50', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        Niveau d'urgence <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {options.map(({ value, icon: Icon, color, bg, border, desc }) => {
          const isSelected = urgency === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              style={{
                flex: '1 1 200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? color : '#E5E7EB'}`,
                backgroundColor: isSelected ? bg : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: isSelected ? color : '#4B5563', fontWeight: '700', fontSize: '0.95rem' }}>
                <Icon size={18} /> {value}
              </div>
              <div style={{ fontSize: '0.75rem', color: isSelected ? '#4B5563' : '#9CA3AF', lineHeight: '1.4' }}>
                {desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UrgencySelector;
