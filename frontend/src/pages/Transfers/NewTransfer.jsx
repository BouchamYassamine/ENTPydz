import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransferApi, MaterielApi, CentreApi } from '../../services/api.js';
import useAuth from '../../hooks/useAuth.js';
import { Send, ArrowLeft, Package, MapPin } from 'lucide-react';

const iS = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' };
const lS = { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };

const NewTransfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [centres, setCentres] = useState([]);
  const [formData, setFormData] = useState({ materialId: '', destinationCentreId: '', comments: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch materials available in user's center
        const mRes = await MaterielApi.getMateriels({ centreId: user.centreId, statut: 'Disponible' });
        if (mRes.success) setMaterials(mRes.data);

        // Fetch all centers for destination
        const cRes = await CentreApi.getCentres();
        if (cRes.success) {
          // Exclude user's own center from destination options
          setCentres(cRes.data.filter(c => c.id !== user.centreId));
        }
      } catch {
        setMsg({ text: "Erreur lors du chargement des données", type: 'error' });
      }
    };
    fetchData();
  }, [user.centreId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.materialId || !formData.destinationCentreId) {
      setMsg({ text: "Veuillez remplir tous les champs obligatoires", type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await TransferApi.createTransfert(formData);
      navigate('/transfers');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Erreur de création", type: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button onClick={() => navigate('/transfers')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Retour aux transferts
      </button>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={24} color="#FF6B35" />
          Initier un Transfert
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>Demandez le transfert d'un matériel de votre centre vers un autre centre ENTP. Cette demande devra être validée par votre responsable.</p>

        {msg.text && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: msg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: msg.type === 'error' ? '#ef4444' : '#16a34a', fontWeight: '500' }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lS}><Package size={14} style={{verticalAlign:'middle',marginRight:'0.3rem'}}/> Matériel à transférer <span style={{color:'#ef4444'}}>*</span></label>
            <select 
              value={formData.materialId} 
              onChange={e => setFormData({...formData, materialId: e.target.value})} 
              style={{ ...iS, backgroundColor: '#f8fafc' }}
              required
            >
              <option value="">-- Sélectionnez un matériel disponible --</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.barcode} - {m.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lS}><MapPin size={14} style={{verticalAlign:'middle',marginRight:'0.3rem'}}/> Centre de destination <span style={{color:'#ef4444'}}>*</span></label>
            <select 
              value={formData.destinationCentreId} 
              onChange={e => setFormData({...formData, destinationCentreId: e.target.value})} 
              style={{ ...iS, backgroundColor: '#f8fafc' }}
              required
            >
              <option value="">-- Sélectionnez le centre de destination --</option>
              {centres.map(c => (
                <option key={c.id} value={c.id}>{c.nom} ({c.ville})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={lS}>Motif / Commentaires</label>
            <textarea 
              value={formData.comments} 
              onChange={e => setFormData({...formData, comments: e.target.value})} 
              style={{ ...iS, resize: 'vertical', minHeight: '100px', backgroundColor: '#f8fafc' }} 
              placeholder="Expliquez la raison de ce transfert..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', backgroundColor: '#FF6B35', color: '#fff', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(255,107,53,0.2)' }}
            >
              {submitting ? 'Création...' : <><Send size={16} /> Envoyer la demande</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransfer;
