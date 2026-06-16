import React, { useEffect, useState } from 'react';
import { CheckCircle, List, PlusCircle, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BonTransfertPrint from './BonTransfertPrint.jsx';

const SuccessScreen = ({ transfer, onNewTransfer }) => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(0.8);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Animation simple
    setTimeout(() => {
      setScale(1);
      setOpacity(1);
    }, 50);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!transfer) return null;

  return (
    <>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '16px', 
        padding: '4rem 2rem', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: `scale(${scale})`,
        opacity: opacity
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#F0FDF4', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle size={48} color="#10B981" />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1A1A2E', marginBottom: '0.5rem' }}>
          Demande soumise avec succès !
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '0.5rem' }}>
          Votre bon de transfert <strong style={{ color: '#E05A1E', backgroundColor: '#FDF2ED', padding: '2px 8px', borderRadius: '4px' }}>{transfer.numero || 'BT-XXXX'}</strong> a été créé.
        </p>
        
        <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '2.5rem' }}>
          Votre responsable de centre sera notifié pour validation.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={handlePrint}
            style={{ 
              padding: '0.8rem 1.5rem', 
              borderRadius: '8px', 
              border: '1.5px solid #E05A1E', 
              backgroundColor: '#fff', 
              color: '#E05A1E', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FDF2ED'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            <Printer size={18} /> Imprimer le bon de transfert
          </button>

          <button 
            onClick={() => navigate('/transfers')}
            style={{ 
              padding: '0.8rem 1.5rem', 
              borderRadius: '8px', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff', 
              color: '#4B5563', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            <List size={18} /> Voir mes transferts
          </button>
          
          <button 
            onClick={onNewTransfer}
            style={{ 
              padding: '0.8rem 1.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: '#E05A1E', 
              color: '#fff', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(224, 90, 30, 0.2)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(224, 90, 30, 0.3)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(224, 90, 30, 0.2)'; }}
          >
            <PlusCircle size={18} /> Nouveau transfert
          </button>
        </div>
      </div>
      
      {/* Composant d'impression invisible à l'écran */}
      <BonTransfertPrint transfer={transfer} />
    </>
  );
};

export default SuccessScreen;
