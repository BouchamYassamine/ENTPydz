import React from 'react';
import { ClipboardList, CheckCircle, Circle, ShieldAlert } from 'lucide-react';

const Row = ({ label, value, isOfficialStamp }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
    <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '500' }}>{label}</span>
    {isOfficialStamp ? (
      <span style={{
        fontSize: '0.8rem',
        fontWeight: '800',
        color: '#E05A1E',
        backgroundColor: '#FDF2ED',
        padding: '2px 8px',
        borderRadius: '4px',
        border: '1px dashed #E05A1E',
        letterSpacing: '0.05em'
      }}>
        {value}
      </span>
    ) : (
      <span style={{
        fontSize: '0.8rem',
        fontWeight: '600',
        color: value ? '#1E293B' : '#94A3B8',
        textAlign: 'right',
        maxWidth: '55%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontStyle: value ? 'normal' : 'italic'
      }}>
        {value || 'Non renseigné'}
      </span>
    )}
  </div>
);

const Divider = () => (
  <div style={{ borderTop: '1px solid #E2E8F0', margin: '8px 0' }} />
);

const TransferRecapCard = ({
  material,
  sourceCentre,
  destinationCentre,
  quantity,
  urgency,
  date,
  numero,
  isSubmitted = false,
  isFormReady = false,
  onPrint,
  motif
}) => {
  const urgencyLabel =
    urgency === 'Normal'   ? '🟢 Normal'   :
    urgency === 'Urgent'   ? '🟡 Urgent'   :
                             '🔴 Critique';

  const isPrintable = isFormReady || isSubmitted;

  const handlePrint = () => {
    if (isPrintable && onPrint) onPrint();
  };

  const printLabel = isSubmitted
    ? 'Imprimer le bon officiel'
    : isFormReady
      ? 'Aperçu / Imprimer'
      : 'Générer le bon PDF';

  const printTitle = !isPrintable
    ? 'Remplissez les champs obligatoires d\'abord'
    : isSubmitted
      ? 'Imprimer le bon de transfert officiel'
      : 'Générer un aperçu PDF (brouillon)';

  // Calculate completion percentage
  let completedFields = 0;
  const totalFields = 3;
  
  const hasMaterial = !!material;
  const hasDestination = !!destinationCentre;
  const hasMotif = !!motif && motif.trim().length >= 10;
  
  if (hasMaterial) completedFields++;
  if (hasDestination) completedFields++;
  if (hasMotif) completedFields++;
  
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '1.5rem',
      color: '#1E293B',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    }}>
      {/* Workflow Alert */}
      <div style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start'
      }}>
        <ShieldAlert size={20} color="#3B82F6" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', fontWeight: '700', color: '#1E3A8A' }}>Circuit de validation</h4>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#2563EB', lineHeight: '1.4' }}>
            Demandeur → Responsable Centre → Validation Finale
          </p>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <ClipboardList size={20} color="#2C3E50" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#2C3E50', textTransform: 'uppercase' }}>Récapitulatif</h3>
      </div>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B' }}>Complétion du dossier</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: completionPercentage === 100 ? '#10B981' : '#E05A1E' }}>{completionPercentage}%</span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${completionPercentage}%`, 
            backgroundColor: completionPercentage === 100 ? '#10B981' : '#E05A1E',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <Divider />

      {/* Rows */}
      <Row label="N° Bon Officiel" value={numero} isOfficialStamp />
      <Row label="Date"       value={date} />
      <Row label="Émetteur"   value={sourceCentre?.nom} />
      <Row label="Récepteur"  value={destinationCentre?.nom} />
      <Row label="Matériel"   value={material ? `${material.name} (${material.barcode})` : null} />
      <Row label="Quantité"   value={quantity} />
      <Row label="Urgence"    value={urgencyLabel} />

      <Divider />

      {/* Conformity Checklist */}
      <div style={{ padding: '0.5rem 0', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Conformité</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: hasMaterial ? '#1E293B' : '#94A3B8' }}>
            {hasMaterial ? <CheckCircle size={16} color="#10B981" /> : <Circle size={16} />} Code matériel valide
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: hasDestination ? '#1E293B' : '#94A3B8' }}>
            {hasDestination ? <CheckCircle size={16} color="#10B981" /> : <Circle size={16} />} Centre récepteur sélectionné
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: hasMotif ? '#1E293B' : '#94A3B8' }}>
            {hasMotif ? <CheckCircle size={16} color="#10B981" /> : <Circle size={16} />} Motif renseigné
          </div>
        </div>
      </div>

      <Divider />

      {/* Bouton PDF */}
      <button
        type="button"
        onClick={handlePrint}
        disabled={!isPrintable}
        title={printTitle}
        style={{
          width: '100%',
          marginTop: '0.5rem',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: isPrintable ? '#E05A1E' : '#E2E8F0',
          backgroundColor: isPrintable ? '#FFF5F0' : '#F1F5F9',
          color: isPrintable ? '#C94D18' : '#94A3B8',
          fontWeight: '700',
          fontSize: '0.85rem',
          cursor: isPrintable ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => { if (isPrintable) { e.currentTarget.style.backgroundColor = '#FDF2ED'; } }}
        onMouseOut={(e)  => { if (isPrintable) { e.currentTarget.style.backgroundColor = '#FFF5F0';  } }}
      >
        🖨️ {printLabel}
      </button>

    </div>
  );
};

export default TransferRecapCard;
