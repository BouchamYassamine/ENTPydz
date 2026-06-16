import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransferApi } from '../../services/api.js';
import useAuth from '../../hooks/useAuth.js';
import { ArrowRight, Check, X, RefreshCw, Plus, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Badge = ({ status }) => {
  let color = '#64748b', bg = '#f1f5f9';
  if (status === 'En attente') { color = '#F57F17'; bg = '#FFF8E1'; }
  if (status === 'Approuvé') { color = '#2E7D32'; bg = '#E8F5E9'; }
  if (status === 'Réceptionné') { color = '#16a34a'; bg = 'rgba(34,197,94,0.1)'; }
  if (status === 'Refusé') { color = '#C62828'; bg = '#FFEBEE'; }
  return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color, backgroundColor: bg }}>{status}</span>;
};

const DirectionBadge = ({ isEnvoye }) => {
  const color = '#E05A1E';
  return (
    <span style={{ color, fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.2rem' }}>
      {isEnvoye ? <><ArrowUpRight size={12}/> ENVOYÉ</> : <><ArrowDownLeft size={12}/> REÇU</>}
    </span>
  );
};

const TransferList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [tab, setTab] = useState('tous'); // 'tous', 'envoyes', 'recus'
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, [user]); // fetch once, we filter locally for tabs

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await TransferApi.getTransfers();
      if (res.success) setTransfers(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApproveConfirm = async () => {
    if (!selectedTransfer) return;
    try {
      await TransferApi.validateTransfert(selectedTransfer.id, { status: 'Approuvé' });
      setShowApproveModal(false);
      setSelectedTransfer(null);
      fetchTransfers();
      // TODO: Show success toast
    } catch (err) {
      alert("Erreur lors de l'approbation");
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedTransfer || !rejectReason.trim()) return;
    try {
      await TransferApi.validateTransfert(selectedTransfer.id, { status: 'Refusé', motif: rejectReason });
      setShowRejectModal(false);
      setSelectedTransfer(null);
      setRejectReason('');
      fetchTransfers();
      // TODO: Show success toast
    } catch (err) {
      alert("Erreur lors du refus");
    }
  };

  const isEnvoye = (t) => t.sourceCentreId === user.centreId;
  const isRecu = (t) => t.destinationCentreId === user.centreId;

  // Filter transfers based on current tab
  const filteredTransfers = transfers.filter(t => {
    if (user.role === 'Admin') return true; // Admin voit tout
    if (tab === 'tous') return true;
    if (tab === 'envoyes') return isEnvoye(t);
    if (tab === 'recus') return isRecu(t);
    return true;
  });

  const countEnvoyes = transfers.filter(isEnvoye).length;
  const countRecus = transfers.filter(isRecu).length;
  const countTous = transfers.length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ color: '#E05A1E', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowRight size={24} />
            Suivi des Transferts
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Gérez les flux de matériel entre les centres ENTP.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchTransfers} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#64748b', cursor: 'pointer' }}>
            <RefreshCw size={18} />
          </button>
          {user.role !== 'Admin Centre' && user.role !== 'Admin' && (
            <button onClick={() => navigate('/transfers/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#E05A1E', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
              <Plus size={18} /> Nouveau Transfert
            </button>
          )}
        </div>
      </div>

      {user.role !== 'Admin' && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setTab('tous')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', border: 'none', backgroundColor: tab === 'tous' ? '#E05A1E' : 'transparent', color: tab === 'tous' ? '#fff' : '#64748b', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            Tous
            <span style={{ backgroundColor: tab === 'tous' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: tab === 'tous' ? '#fff' : '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{countTous}</span>
          </button>
          <button onClick={() => setTab('envoyes')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', border: 'none', backgroundColor: tab === 'envoyes' ? '#E05A1E' : 'transparent', color: tab === 'envoyes' ? '#fff' : '#64748b', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            <ArrowUpRight size={16} /> Envoyés
            <span style={{ backgroundColor: tab === 'envoyes' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: tab === 'envoyes' ? '#fff' : '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{countEnvoyes}</span>
          </button>
          <button onClick={() => setTab('recus')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', border: 'none', backgroundColor: tab === 'recus' ? '#E05A1E' : 'transparent', color: tab === 'recus' ? '#fff' : '#64748b', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            <ArrowDownLeft size={16} /> Reçus
            <span style={{ backgroundColor: tab === 'recus' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', color: tab === 'recus' ? '#fff' : '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{countRecus}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Chargement...</div>
      ) : filteredTransfers.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#475569', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Aucun transfert trouvé</h3>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Les transferts apparaîtront ici dès qu'ils seront créés.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>N°</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matériel</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Centre Source</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Centre Dest.</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Envoyé par</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f8fafc' } }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#E05A1E', fontWeight: '700', fontSize: '0.9rem' }}>TR-{t.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{t.material?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>{t.material?.barcode}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#334155', fontSize: '0.85rem' }}>
                    {t.sourceCentre?.nom}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#334155', fontSize: '0.85rem' }}>
                    {t.destinationCentre?.nom}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: '600', color: '#334155', fontSize: '0.85rem' }}>{t.requester?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>{t.sourceCentre?.nom}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {user.role !== 'Admin' && <DirectionBadge isEnvoye={isEnvoye(t)} />}
                    <Badge status={t.status} />
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                    {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/transfers/${t.id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: '#1C2333', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                        Détails
                      </button>
                      {(user.role === 'Admin Centre' || user.role === 'Admin') && t.status === 'En attente' && (
                        <>
                           <button onClick={() => { setSelectedTransfer(t); setShowApproveModal(true); }} style={{ padding: '0.5rem', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Approuver"><Check size={16} /></button>
                           <button onClick={() => { setSelectedTransfer(t); setShowRejectModal(true); }} style={{ padding: '0.5rem', backgroundColor: '#C62828', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Refuser"><X size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Approuver */}
      {showApproveModal && selectedTransfer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '400px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Confirmer l'approbation du transfert TR-{selectedTransfer.id.toString().padStart(4, '0')} ?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <strong>Matériel :</strong> {selectedTransfer.material?.name}<br/>
              <strong>De :</strong> {selectedTransfer.sourceCentre?.nom} <br/>
              <strong>Vers :</strong> {selectedTransfer.destinationCentre?.nom}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setShowApproveModal(false)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>Annuler</button>
              <button onClick={handleApproveConfirm} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#2E7D32', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Check size={16}/> Confirmer l'approbation</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Refuser */}
      {showRejectModal && selectedTransfer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '400px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Refuser le transfert TR-{selectedTransfer.id.toString().padStart(4, '0')}</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#334155' }}>Motif du refus <span style={{color: '#ef4444'}}>*</span></label>
              <textarea 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez la raison du refus..."
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setShowRejectModal(false)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' }}>Annuler</button>
              <button onClick={handleRejectConfirm} disabled={!rejectReason.trim()} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#C62828', color: '#fff', cursor: !rejectReason.trim() ? 'not-allowed' : 'pointer', opacity: !rejectReason.trim() ? 0.6 : 1, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><X size={16}/> Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferList;
