import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import { ArrowLeft, Check, X, FileText } from 'lucide-react';

const TransferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simulation d'un détail de transfert récupéré
  const transfer = {
    id: id || 'TR-742',
    materialName: 'Moteur de boue 6-1/2" (Drilling Mud Motor)',
    barcode: 'ENTP-EQP-984210',
    sourceService: 'Forage',
    destinationService: 'Maintenance',
    status: 'En attente',
    reason: 'Révision technique périodique obligatoire avant déploiement sur le puits Hassi Messaoud #402.',
    requesterName: 'Mourad Belkacem',
    requesterRole: 'Chef de Chantier / Responsable Forage',
    requestedAt: '14 Juin 2026 à 09:15',
    comment: ''
  };

  const isValidator = ['Admin', 'Responsable Service'].includes(user?.role);

  const handleAction = (decision) => {
    alert(`Transfert ${decision === 'approve' ? 'Approuvé' : 'Refusé'} avec succès !`);
    navigate('/transfers');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Bouton Retour */}
      <button 
        onClick={() => navigate('/transfers')}
        style={{
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--gray-600)',
          fontSize: '0.9rem',
          fontWeight: '500',
          marginBottom: '1.5rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </button>

      {/* Titre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-color)' }}>
          Détail de la demande {transfer.id}
        </h1>
        <span 
          style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: '700',
            backgroundColor: '#fffbeb',
            color: 'var(--warning-color)'
          }}
        >
          {transfer.status}
        </span>
      </div>

      {/* Détails du Matériel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
            <FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Informations sur le Matériel
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Désignation</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.materialName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Code Barre / Code Inventaire</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.barcode}</strong>
            </div>
          </div>
        </div>

        {/* Détails de la Demande */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
            Détails de l'Acheminement
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Service Émetteur</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.sourceService}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Service Récepteur</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.destinationService}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Demandé par</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.requesterName}</strong>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--gray-400)' }}>{transfer.requesterRole}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Date de Demande</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.requestedAt}</strong>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Motif du transfert</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', background: 'var(--light-color)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.25rem' }}>
              {transfer.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Actions de validation si l'utilisateur est habilité */}
      {transfer.status === 'En attente' && isValidator && (
        <div className="card" style={{ border: '1px solid var(--secondary-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-color)' }}>
            Espace d'approbation et signature
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
            En tant que Responsable ou Administrateur, vous êtes invité à approuver ou refuser cette sortie de matériel inter-services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button onClick={() => handleAction('approve')} variant="success">
              <Check size={16} />
              Approuver la demande
            </Button>
            <Button onClick={() => handleAction('reject')} variant="danger">
              <X size={16} />
              Refuser la demande
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferDetail;
