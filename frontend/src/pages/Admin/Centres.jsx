import React, { useState, useEffect } from 'react';
import { CentreApi } from '../../services/api.js';
import { Trash2, Edit, Plus, X, Eye, MapPin, Building2, Users, Package } from 'lucide-react';
import NouveauCentreModal from '../../components/admin/NouveauCentreModal';

const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };

const Centres = () => {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [formData, setFormData] = useState({ nom: '', ville: '', adresse: '' });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => { fetchCentres(); }, []);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      const res = await CentreApi.getCentres();
      if (res.success) setCentres(res.data);
    } catch { showMsg("Erreur lors du chargement", "error"); }
    finally { setLoading(false); }
  };

  const showMsg = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000); };

  const openModal = (centre = null) => {
    if (centre) {
      setEditingId(centre.id);
      setFormData({ nom: centre.nom, ville: centre.ville, adresse: centre.adresse || '' });
    } else {
      setEditingId(null);
      setFormData({ nom: '', ville: '', adresse: '' });
    }
    setShowModal(true);
  };

  const openDetail = async (id) => {
    try {
      const res = await CentreApi.getCentreById(id);
      if (res.success) setShowDetail(res.data);
    } catch { showMsg("Erreur lors du chargement du détail", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await CentreApi.updateCentre(editingId, formData);
        showMsg("Centre modifié avec succès", "success");
      } else {
        await CentreApi.createCentre(formData);
        showMsg("Centre créé avec succès", "success");
      }
      setShowModal(false);
      fetchCentres();
    } catch (err) { showMsg(err.response?.data?.message || "Erreur", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce centre ?")) return;
    try {
      await CentreApi.deleteCentre(id);
      showMsg("Centre supprimé", "success");
      fetchCentres();
    } catch (err) { showMsg(err.response?.data?.message || "Erreur lors de la suppression", "error"); }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.3rem' }}>
            <Building2 size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Gestion des Centres
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Gérez les centres et bases opérationnelles ENTP.</p>
        </div>
        <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FF6B35', color: 'white', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(255, 107, 53, 0.2)' }}>
          <Plus size={18} /> Nouveau Centre
        </button>
      </div>

      {/* Toast */}
      {msg.text && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: msg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: msg.type === 'error' ? '#ef4444' : '#16a34a', border: `1px solid ${msg.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`, fontWeight: '500' }}>
          {msg.text}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>Chargement...</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Nom du Centre', 'Ville', 'Adresse', 'Utilisateurs', 'Matériels', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.2rem', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {centres.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.1rem 1.2rem', fontWeight: '600', color: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} color="#FF6B35" /> {c.nom}
                    </div>
                  </td>
                  <td style={{ padding: '1.1rem 1.2rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {c.ville}</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.2rem', color: '#64748b', fontSize: '0.9rem' }}>{c.adresse || '-'}</td>
                  <td style={{ padding: '1.1rem 1.2rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>{c._count?.users || 0}</span>
                  </td>
                  <td style={{ padding: '1.1rem 1.2rem', textAlign: 'center' }}>
                    <span style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>{c._count?.materials || 0}</span>
                  </td>
                  <td style={{ padding: '1.1rem 1.2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openDetail(c.id)} style={{ background: 'rgba(34,197,94,0.1)', border: 'none', color: '#16a34a', cursor: 'pointer', padding: '0.45rem', borderRadius: '6px' }} title="Détails"><Eye size={16} /></button>
                      <button onClick={() => openModal(c)} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.45rem', borderRadius: '6px' }} title="Modifier"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.45rem', borderRadius: '6px' }} title="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {centres.length === 0 && <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Aucun centre trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Création */}
      {showModal && !editingId && (
        <NouveauCentreModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            showMsg("Centre créé avec succès", "success");
            fetchCentres();
          }}
        />
      )}

      {/* L'édition est retirée provisoirement, ou on peut garder l'ancien form pour l'édition uniquement. Pour l'instant, selon la demande, on remplace la modale de création. Si on garde l'édition, on la met dans un bloc séparé, mais on va simplement utiliser NouveauCentreModal pour la création. */}
      {showModal && editingId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Modifier le centre</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Nom du centre <span style={{color:'#ef4444'}}>*</span></label>
                <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={inputStyle} placeholder="Ex: Base Forage HMD" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Ville <span style={{color:'#ef4444'}}>*</span></label>
                <input required value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})} style={inputStyle} placeholder="Sélectionnez ou tapez une ville" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#E05A1E', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail */}
      {showDetail && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', position: 'sticky', top: 0 }}>
              <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{showDetail.nom}</h2>
              <button onClick={() => setShowDetail(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>Ville</div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}><MapPin size={14} style={{verticalAlign:'middle'}} /> {showDetail.ville}</div>
                </div>
                <div style={{ flex: 1, padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>Adresse</div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{showDetail.adresse || 'Non renseignée'}</div>
                </div>
              </div>

              {/* Utilisateurs */}
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#3b82f6" /> Utilisateurs ({showDetail.users?.length || 0})
              </h3>
              {showDetail.users?.length > 0 ? (
                <div style={{ marginBottom: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {showDetail.users.map(u => (
                    <div key={u.id} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><strong>{u.name}</strong> <span style={{color:'#64748b'}}>— {u.email}</span></div>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: u.role === 'Admin' ? 'rgba(255,107,53,0.1)' : '#f1f5f9', color: u.role === 'Admin' ? '#FF6B35' : '#64748b' }}>{u.role}</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{color:'#94a3b8', marginBottom:'2rem'}}>Aucun utilisateur affecté.</p>}

              {/* Matériels */}
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="#8b5cf6" /> Matériels ({showDetail.materials?.length || 0})
              </h3>
              {showDetail.materials?.length > 0 ? (
                <div style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {showDetail.materials.map(m => (
                    <div key={m.id} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><span style={{color:'#94a3b8', fontSize:'0.85rem'}}>{m.barcode}</span> — <strong>{m.name}</strong></div>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: m.status === 'Disponible' ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,53,0.1)', color: m.status === 'Disponible' ? '#16a34a' : '#FF6B35' }}>{m.status}</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{color:'#94a3b8'}}>Aucun matériel affecté.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Centres;
