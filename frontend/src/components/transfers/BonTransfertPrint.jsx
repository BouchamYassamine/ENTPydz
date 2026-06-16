import React from 'react';

const BonTransfertPrint = ({ transfer }) => {
  if (!transfer) return null;

  // Formatter la date (requestedAt)
  const dateFormatted = new Date(transfer.requestedAt || Date.now()).toLocaleDateString('fr-FR');
  const dateTimeFormatted = new Date(transfer.requestedAt || Date.now()).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const isApproved = transfer.status === 'Approuvé' || transfer.status === 'Complété';

  return (
    <div id="bon-transfert-print" className="hidden print:block" style={{
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      backgroundColor: '#fff',
      padding: '20px',
      fontSize: '11px',
      lineHeight: '1.5'
    }}>
      
      {/* En-tête avec Logo et Titre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E05A1E', paddingBottom: '15px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E05A1E', margin: 0, letterSpacing: '1px' }}>ENTP</h1>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>ENTREPRISE NATIONALE DES TRAVAUX AUX PUITS</div>
          <div style={{ fontSize: '9px', color: '#555' }}>Groupe Sonatrach</div>
        </div>
        <div style={{ flex: 2, textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
            Bon de Transfert de Matériel
          </h2>
          <div style={{ display: 'inline-block', border: '1px solid #333', padding: '4px 12px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#F5F5F5' }}>
            N° {transfer.numero || 'N/A'}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: '10px' }}>
          <div><strong>Date :</strong> {dateFormatted}</div>
          <div><strong>Urgence :</strong> {transfer.urgency || 'Normal'}</div>
          <div>
            <strong>Statut :</strong> 
            <span style={{ 
              marginLeft: '5px',
              padding: '2px 6px',
              border: '1px solid #333',
              backgroundColor: isApproved ? '#dcfce7' : (transfer.status === 'En attente' ? '#fef3c7' : '#fee2e2')
            }}>
              {transfer.status || 'En attente'}
            </span>
          </div>
        </div>
      </div>

      {/* Émetteur & Récepteur */}
      <div style={{ display: 'flex', border: '1px solid #333', marginBottom: '20px' }}>
        <div style={{ flex: 1, borderRight: '1px solid #333' }}>
          <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
            CENTRE ÉMETTEUR
          </div>
          <div style={{ padding: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{transfer.sourceCentre?.nom}</div>
            <div>{transfer.sourceCentre?.direction?.nom || 'Direction inconnue'}</div>
            <div>{transfer.sourceCentre?.ville}{transfer.sourceCentre?.wilaya ? `, ${transfer.sourceCentre.wilaya}` : ''}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
            CENTRE RÉCEPTEUR
          </div>
          <div style={{ padding: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{transfer.destinationCentre?.nom}</div>
            <div>{transfer.destinationCentre?.direction?.nom || 'Direction inconnue'}</div>
            <div>{transfer.destinationCentre?.ville}{transfer.destinationCentre?.wilaya ? `, ${transfer.destinationCentre.wilaya}` : ''}</div>
          </div>
        </div>
      </div>

      {/* Matériel */}
      <div style={{ border: '1px solid #333', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
          DÉSIGNATION DU MATÉRIEL
        </div>
        <div style={{ padding: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px', padding: '4px 0', fontWeight: 'bold' }}>Nom :</td>
                <td style={{ padding: '4px 0', fontSize: '13px', fontWeight: 'bold' }}>{transfer.material?.name || '-'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Code Barre (Barcode) :</td>
                <td style={{ padding: '4px 0', fontFamily: 'monospace', fontSize: '12px' }}>{transfer.material?.barcode || '-'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Quantité :</td>
                <td style={{ padding: '4px 0' }}>{transfer.quantity || 1} Unité(s)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Motif & Observations */}
      <div style={{ border: '1px solid #333', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
          MOTIF DU TRANSFERT
        </div>
        <div style={{ padding: '10px', minHeight: '40px' }}>
          {transfer.motif || transfer.comments || 'Aucun motif renseigné.'}
        </div>
        <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333', borderTop: '1px solid #333' }}>
          OBSERVATIONS
        </div>
        <div style={{ padding: '10px', minHeight: '40px' }}>
          {transfer.observations || '-'}
        </div>
      </div>

      {/* Demandeur */}
      <div style={{ border: '1px solid #333', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#F5F5F5', padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
          DEMANDÉ PAR
        </div>
        <div style={{ padding: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px', padding: '2px 0', fontWeight: 'bold' }}>Nom :</td>
                <td style={{ padding: '2px 0' }}>{transfer.requester?.name || 'Inconnu'}</td>
              </tr>
              <tr>
                <td style={{ padding: '2px 0', fontWeight: 'bold' }}>Centre / Service :</td>
                <td style={{ padding: '2px 0' }}>{transfer.sourceCentre?.nom}</td>
              </tr>
              <tr>
                <td style={{ padding: '2px 0', fontWeight: 'bold' }}>Date & Heure :</td>
                <td style={{ padding: '2px 0' }}>{dateTimeFormatted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '12px' }}>SIGNATURES & APPROBATIONS</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '30%', border: '1px solid #333', padding: '10px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>Le Demandeur</div>
            <div style={{ fontSize: '9px', textAlign: 'center', color: '#555', marginBottom: 'auto' }}>Nom & Signature</div>
            <div style={{ borderBottom: '1px dashed #999', marginTop: '40px' }}></div>
          </div>
          <div style={{ width: '30%', border: '1px solid #333', padding: '10px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>Responsable Centre Émetteur</div>
            <div style={{ fontSize: '9px', textAlign: 'center', color: '#555', marginBottom: 'auto' }}>Nom & Signature</div>
            <div style={{ borderBottom: '1px dashed #999', marginTop: '40px' }}></div>
          </div>
          <div style={{ width: '30%', border: '1px solid #333', padding: '10px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>Responsable Centre Récepteur</div>
            <div style={{ fontSize: '9px', textAlign: 'center', color: '#555', marginBottom: 'auto' }}>Nom & Signature</div>
            <div style={{ borderBottom: '1px dashed #999', marginTop: '40px' }}></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '9px', color: '#555', textAlign: 'center' }}>
        <div>Document généré le {dateTimeFormatted} — Système de Gestion ENTP v1.0.0 © ENTP 2026</div>
        <div><strong>Ce document est valable uniquement après approbation du responsable de centre.</strong></div>
      </div>

    </div>
  );
};

export default BonTransfertPrint;
