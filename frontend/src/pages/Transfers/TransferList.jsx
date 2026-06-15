import React, { useState } from 'react';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

const TransferList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Données fictives adaptées aux travaux pétroliers (ENTP)
  const [transfers] = useState([
    { id: 'TR-742', material: 'Moteur de boue 6-1/2"', from: 'Forage', to: 'Maintenance', requester: 'M. Belkacem', status: 'En attente', date: '14/06/2026' },
    { id: 'TR-741', material: 'Vanne de sécurité BOP 13-5/8"', from: 'Sécurité', to: 'Forage', requester: 'A. Khelifi', status: 'Approuvé', date: '13/06/2026' },
    { id: 'TR-740', material: 'Tiges de forage 5" (x50)', from: 'Forage', to: 'Logistique', requester: 'M. Belkacem', status: 'Refusé', date: '11/06/2026' },
    { id: 'TR-739', material: 'Pompe centrifuge de surpression', from: 'Maintenance', to: 'Production', requester: 'S. Touati', status: 'Complété', date: '10/06/2026' },
  ]);

  const headers = ['N° Transfert', 'Matériel', 'De (Émetteur)', 'Vers (Récepteur)', 'Initié par', 'Statut', 'Date', 'Actions'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return { bg: '#e6fffa', text: 'var(--success-color)' };
      case 'Refusé': return { bg: '#fef2f2', text: 'var(--danger-color)' };
      case 'En attente': return { bg: '#fffbeb', text: 'var(--warning-color)' };
      default: return { bg: '#f1f5f9', text: 'var(--gray-600)' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-color)' }}>
            Suivi des Transferts de Matériel
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Consultez et validez les demandes d'échanges de ressources inter-services.
          </p>
        </div>

        {/* Bouton de création visible par Admins et Managers */}
        {['Admin', 'Responsable Service'].includes(user?.role) && (
          <Button onClick={() => navigate('/transfers/new')} variant="primary">
            <Plus size={18} />
            Demander un transfert
          </Button>
        )}
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <Table 
          headers={headers}
          data={transfers}
          renderRow={(transfer, idx) => {
            const colors = getStatusColor(transfer.status);
            return (
              <tr key={idx} style={{ borderBottom: '1px solid var(--gray-200)', transition: 'background-color 0.15s' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--primary-color)' }}>{transfer.id}</td>
                <td style={{ padding: '1rem' }}>{transfer.material}</td>
                <td style={{ padding: '1rem' }}>{transfer.from}</td>
                <td style={{ padding: '1rem' }}>{transfer.to}</td>
                <td style={{ padding: '1rem' }}>{transfer.requester}</td>
                <td style={{ padding: '1rem' }}>
                  <span 
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}
                  >
                    {transfer.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{transfer.date}</td>
                <td style={{ padding: '1rem' }}>
                  <Button 
                    onClick={() => navigate(`/transfers/${transfer.id}`)}
                    variant="secondary"
                    style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                  >
                    Détails
                  </Button>
                </td>
              </tr>
            );
          }}
        />
      </div>
    </div>
  );
};

export default TransferList;
