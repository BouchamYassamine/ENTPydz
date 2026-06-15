import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--light-color)',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <AlertTriangle size={64} color="var(--danger-color)" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
        404 - Page Non Trouvée
      </h1>
      <p style={{ color: 'var(--gray-600)', maxWidth: '450px', marginBottom: '2rem' }}>
        Désolé, la page que vous recherchez n'existe pas ou vous n'avez pas l'autorisation d'y accéder.
      </p>
      <Button onClick={() => navigate('/login')} variant="primary">
        Retourner à l'accueil
      </Button>
    </div>
  );
};

export default NotFound;
