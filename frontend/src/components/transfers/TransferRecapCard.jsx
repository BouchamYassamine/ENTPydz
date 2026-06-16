import React from 'react';
import { ClipboardList } from 'lucide-react';

const Row = ({ label, value, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{label}</span>
    <span style={{
      fontSize: '0.78rem',
      fontWeight: '600',
      color: accent ? '#E05A1E' : 'rgba(255,255,255,0.9)',
      textAlign: 'right',
      maxWidth: '55%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {value || <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>—</span>}
    </span>
  </div>
);

const Divider = () => (
  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />
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
    ? '🖨️ Imprimer le bon officiel'
    : isFormReady
      ? '🖨️ Aperçu / Imprimer'
      : '🖨️ Générer le bon PDF';

  const printTitle = !isPrintable
    ? 'Remplissez les champs obligatoires d\'abord'
    : isSubmitted
      ? 'Imprimer le bon de transfert officiel'
      : 'Générer un aperçu PDF (brouillon)';

  return (
    <div style={{
      backgroundColor: '#1C2333',
      borderRadius: '16px',
      padding: '1.5rem',
      color: '#fff',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <ClipboardList size={20} color="#E05A1E" />
        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, letterSpacing: '0.3px' }}>Récapitulatif</h3>
      </div>

      <Divider />

      {/* Rows */}
      <Row label="N° Bon"     value={numero}                    accent />
      <Row label="Date"       value={date} />
      <Row label="Émetteur"   value={sourceCentre?.nom} />
      <Row label="Récepteur"  value={destinationCentre?.nom} />
      <Row label="Matériel"   value={material ? `${material.name} (${material.barcode})` : null} />
      <Row label="Quantité"   value={quantity} />
      <Row label="Urgence"    value={urgencyLabel} />

      <Divider />

      {/* Statut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>Statut</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: isSubmitted ? '#F59E0B' : 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isSubmitted ? '#F59E0B' : 'rgba(255,255,255,0.2)',
          }} />
          {isSubmitted ? 'En attente' : 'Brouillon'}
        </span>
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
          marginTop: '4px',
          marginBottom: '0.75rem',
          padding: '0.6rem',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isPrintable ? '#E05A1E' : 'rgba(255,255,255,0.06)',
          color: isPrintable ? '#fff' : 'rgba(255,255,255,0.25)',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: isPrintable ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => { if (isPrintable) { e.currentTarget.style.backgroundColor = '#C94D18'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
        onMouseOut={(e)  => { if (isPrintable) { e.currentTarget.style.backgroundColor = '#E05A1E'; e.currentTarget.style.transform = 'translateY(0)';  } }}
      >
        {printLabel}
      </button>

      {/* Avertissement */}
      <div style={{
        backgroundColor: 'rgba(224, 90, 30, 0.1)',
        border: '1px solid rgba(224, 90, 30, 0.2)',
        borderRadius: '8px',
        padding: '0.75rem',
      }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#FDBA74', lineHeight: '1.5', display: 'flex', gap: '0.5rem' }}>
          <span>⚠</span>
          <span>Cette demande sera soumise à validation par votre responsable avant d'être effective.</span>
        </p>
      </div>
    </div>
  );
};

export default TransferRecapCard;
