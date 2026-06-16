import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import { ArrowLeft, Check, X, FileText, Printer } from 'lucide-react';
import { TransferApi } from '../../services/api.js';
import BonTransfertPrint from '../../components/transfers/BonTransfertPrint.jsx';

const TransferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const res = await TransferApi.getTransferById(id);
        if (res.success) {
          setTransfer(res.data);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du transfert ou accès refusé.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransfer();
  }, [id]);

  const isValidator = ['Admin', 'Admin Centre'].includes(user?.role);

  const handleAction = async (decision) => {
    try {
      if (decision === 'approve' || decision === 'reject') {
        const status = decision === 'approve' ? 'Approuvé' : 'Refusé';
        await TransferApi.validateTransfert(transfer.id, { status, motif: '' });
      }
      alert(`Transfert ${decision === 'approve' ? 'Approuvé' : 'Refusé'} avec succès !`);
      navigate('/transfers');
    } catch (err) {
      alert("Une erreur est survenue.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  if (error || !transfer) return <div style={{ textAlign: 'center', padding: '2rem', color: '#EF4444' }}>{error || "Transfert introuvable"}</div>;

  const dateFormatee = new Date(transfer.requestedAt).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Bouton Retour & Imprimer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          Retour à la liste
        </button>

        <button 
          onClick={handlePrint}
          style={{ 
            padding: '0.6rem 1.2rem', 
            borderRadius: '8px', 
            border: '1.5px solid #E05A1E', 
            backgroundColor: '#fff', 
            color: '#E05A1E', 
            fontWeight: '700', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            fontSize: '0.85rem'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FDF2ED'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
        >
          <Printer size={16} /> Imprimer le bon
        </button>
      </div>

      {/* Titre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-color)' }}>
          Détail du Bon {transfer.numero || `TR-${transfer.id}`}
        </h1>
        <span 
          style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: '700',
            backgroundColor: transfer.status === 'Approuvé' ? '#dcfce7' : '#fffbeb',
            color: transfer.status === 'Approuvé' ? '#166534' : 'var(--warning-color)'
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
              <strong style={{ fontSize: '0.95rem' }}>{transfer.material?.name || '-'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Code Barre / Code Inventaire</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.material?.barcode || '-'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Quantité</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.quantity || 1} Unité(s)</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Niveau d'Urgence</span>
              <strong style={{ fontSize: '0.95rem', color: transfer.urgency === 'Critique' ? '#EF4444' : (transfer.urgency === 'Urgent' ? '#F59E0B' : '#10B981') }}>
                {transfer.urgency || 'Normal'}
              </strong>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Centre Émetteur</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.sourceCentre?.nom}</strong>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--gray-400)' }}>{transfer.sourceCentre?.direction?.nom}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Centre Récepteur</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.destinationCentre?.nom}</strong>
              <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--gray-400)' }}>{transfer.destinationCentre?.direction?.nom}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Demandé par</span>
              <strong style={{ fontSize: '0.95rem' }}>{transfer.requester?.name}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Date de Demande</span>
              <strong style={{ fontSize: '0.95rem' }}>{dateFormatee}</strong>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Motif du transfert</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', background: 'var(--light-color)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.25rem' }}>
              {transfer.motif || transfer.comments || 'Aucun motif renseigné.'}
            </p>
          </div>
          {(transfer.observations) && (
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', display: 'block' }}>Observations</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', background: 'var(--light-color)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.25rem' }}>
                {transfer.observations}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions de validation si l'utilisateur est habilité */}
      {transfer.status === 'En attente' && isValidator && user?.centreId === transfer.sourceCentreId && (
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

      {/* Composant d'impression (invisible) */}
      <BonTransfertPrint transfer={transfer} />
    </div>
  );
};

export default TransferDetail;
