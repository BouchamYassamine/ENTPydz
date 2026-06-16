import React, { useState, useEffect } from 'react';
import { MaterielApi, CategorieApi, CentreApi } from '../../services/api.js';
import { Trash2, Edit, Plus, X, Search, Package, Tag, History } from 'lucide-react';
import NouveauMaterielModal from '../../components/admin/NouveauMaterielModal.jsx';

const iS = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' };
const lS = { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };
const Badge = ({ status }) => {
  const isOk = status === 'Disponible';
  return <span style={{ padding:'0.25rem 0.7rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'700', backgroundColor: isOk ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,53,0.1)', color: isOk ? '#16a34a' : '#FF6B35' }}>{status}</span>;
};

const Materiels = () => {
  const [tab, setTab] = useState('materiels');
  const [materiels, setMateriels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showHistory, setShowHistory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catName, setCatName] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [filters, setFilters] = useState({ search: '', categorieId: '', centreId: '', statut: '' });
  const [editingMat, setEditingMat] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [mRes, cRes, ceRes] = await Promise.all([MaterielApi.getMateriels(), CategorieApi.getCategories(), CentreApi.getCentres()]);
      if (mRes.success) setMateriels(mRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (ceRes.success) setCentres(ceRes.data);
    } catch { showMsg("Erreur de chargement", "error"); }
    setLoading(false);
  };

  const showMsg = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000); };

  const fetchMateriels = async () => {
    try {
      const params = {};
      if (filters.categorieId) params.categorieId = filters.categorieId;
      if (filters.centreId) params.centreId = filters.centreId;
      if (filters.statut) params.statut = filters.statut;
      if (filters.search) params.search = filters.search;
      const res = await MaterielApi.getMateriels(params);
      if (res.success) setMateriels(res.data);
    } catch {}
  };

  useEffect(() => { fetchMateriels(); }, [filters]);

  const openMatModal = (m = null) => {
    setEditingMat(m);
    setShowModal(true);
  };

  const openCatModal = (c = null) => {
    if (c) { setEditingCatId(c.id); setCatName(c.nom); }
    else { setEditingCatId(null); setCatName(''); }
    setShowCatModal(true);
  };

  const handleMatSuccess = () => {
    setShowModal(false);
    fetchMateriels();
    showMsg("Opération réussie", "success");
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await CategorieApi.updateCategorie(editingCatId, { nom: catName });
        showMsg("Catégorie modifiée", "success");
      } else {
        await CategorieApi.createCategorie({ nom: catName });
        showMsg("Catégorie créée", "success");
      }
      setShowCatModal(false); load();
    } catch (err) { showMsg(err.response?.data?.message || "Erreur", "error"); }
  };

  const deleteMat = async (id) => {
    if (!window.confirm("Supprimer ce matériel ?")) return;
    try { await MaterielApi.deleteMateriel(id); showMsg("Supprimé", "success"); fetchMateriels(); }
    catch (err) { showMsg(err.response?.data?.message || "Erreur", "error"); }
  };

  const deleteCat = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try { await CategorieApi.deleteCategorie(id); showMsg("Supprimée", "success"); load(); }
    catch (err) { showMsg(err.response?.data?.message || "Erreur", "error"); }
  };

  const viewHistory = async (id) => {
    try {
      const res = await MaterielApi.getMaterielById(id);
      if (res.success) setShowHistory(res.data);
    } catch { showMsg("Erreur", "error"); }
  };

  const tabBtn = (key, label, icon) => (
    <button onClick={() => setTab(key)} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.7rem 1.5rem', border:'none', borderBottom: tab===key ? '3px solid #FF6B35' : '3px solid transparent', background:'none', color: tab===key ? '#FF6B35' : '#64748b', fontWeight: tab===key ? '700' : '500', cursor:'pointer', fontSize:'0.95rem' }}>
      {icon} {label}
    </button>
  );

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
      <h1 style={{ color:'var(--primary-color)', fontSize:'1.8rem', fontWeight:'800', marginBottom:'0.3rem' }}>
        <Package size={28} style={{ verticalAlign:'middle', marginRight:'0.5rem' }} />Gestion des Matériels
      </h1>
      <p style={{ color:'var(--gray-600)', fontSize:'0.95rem', marginBottom:'1.5rem' }}>Inventaire du matériel et catégories ENTP.</p>

      {msg.text && <div style={{ padding:'1rem', marginBottom:'1rem', borderRadius:'8px', backgroundColor: msg.type==='error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: msg.type==='error' ? '#ef4444' : '#16a34a', fontWeight:'500' }}>{msg.text}</div>}

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', marginBottom:'1.5rem' }}>
        {tabBtn('materiels', 'Matériels', <Package size={16}/>)}
        {tabBtn('categories', 'Catégories', <Tag size={16}/>)}
      </div>

      {loading ? <div style={{textAlign:'center',padding:'3rem',color:'#94a3b8'}}>Chargement...</div> : tab === 'materiels' ? (
        <>
          {/* Filters */}
          <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'flex-end' }}>
            <div style={{ flex:'1 1 200px', position:'relative' }}>
              <Search size={16} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
              <input placeholder="Rechercher..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} style={{ ...iS, paddingLeft:'2.5rem' }} />
            </div>
            <select value={filters.categorieId} onChange={e => setFilters({...filters, categorieId: e.target.value})} style={{ ...iS, flex:'0 1 180px' }}>
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
            <select value={filters.centreId} onChange={e => setFilters({...filters, centreId: e.target.value})} style={{ ...iS, flex:'0 1 180px' }}>
              <option value="">Tous centres</option>
              {centres.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            <select value={filters.statut} onChange={e => setFilters({...filters, statut: e.target.value})} style={{ ...iS, flex:'0 1 160px' }}>
              <option value="">Tous statuts</option>
              <option value="Disponible">Disponible</option>
              <option value="En Transfert">En Transfert</option>
            </select>
            <button onClick={() => openMatModal()} style={{ display:'flex', alignItems:'center', gap:'0.4rem', backgroundColor:'#FF6B35', color:'white', border:'none', padding:'0.75rem 1.2rem', borderRadius:'8px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
              <Plus size={16}/> Nouveau
            </button>
          </div>

          {/* Table */}
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
              <thead><tr style={{ backgroundColor:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['Code Barre','Désignation','Catégorie','Centre','Statut','Actions'].map(h => <th key={h} style={{ padding:'1rem 1.2rem', color:'var(--gray-600)', fontWeight:'600', fontSize:'0.8rem', textTransform:'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {materiels.map(m => (
                  <tr key={m.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'1rem 1.2rem', fontFamily:'monospace', color:'#64748b', fontSize:'0.9rem' }}>{m.barcode}</td>
                    <td style={{ padding:'1rem 1.2rem', fontWeight:'500', color:'#1e293b' }}>{m.name}</td>
                    <td style={{ padding:'1rem 1.2rem', color:'#64748b' }}>{m.categorie || '-'}</td>
                    <td style={{ padding:'1rem 1.2rem', color:'#64748b' }}>{m.centre?.nom || m.currentService || '-'}</td>
                    <td style={{ padding:'1rem 1.2rem' }}><Badge status={m.status} /></td>
                    <td style={{ padding:'1rem 1.2rem' }}>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <button onClick={() => viewHistory(m.id)} style={{ background:'rgba(139,92,246,0.1)', border:'none', color:'#8b5cf6', cursor:'pointer', padding:'0.45rem', borderRadius:'6px' }} title="Historique"><History size={15}/></button>
                        <button onClick={() => openMatModal(m)} style={{ background:'rgba(59,130,246,0.1)', border:'none', color:'#3b82f6', cursor:'pointer', padding:'0.45rem', borderRadius:'6px' }} title="Modifier"><Edit size={15}/></button>
                        <button onClick={() => deleteMat(m.id)} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', cursor:'pointer', padding:'0.45rem', borderRadius:'6px' }} title="Supprimer"><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {materiels.length===0 && <tr><td colSpan="6" style={{padding:'3rem',textAlign:'center',color:'#94a3b8'}}>Aucun matériel trouvé.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Categories Tab */
        <>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
            <button onClick={() => openCatModal()} style={{ display:'flex', alignItems:'center', gap:'0.4rem', backgroundColor:'#FF6B35', color:'white', border:'none', padding:'0.7rem 1.2rem', borderRadius:'8px', fontWeight:'600', cursor:'pointer' }}>
              <Plus size={16}/> Nouvelle Catégorie
            </button>
          </div>
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
              <thead><tr style={{ backgroundColor:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['Nom','Nb Matériels','Actions'].map(h => <th key={h} style={{ padding:'1rem 1.2rem', color:'var(--gray-600)', fontWeight:'600', fontSize:'0.8rem', textTransform:'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'1rem 1.2rem', fontWeight:'600', color:'#1e293b' }}><Tag size={14} color="#FF6B35" style={{verticalAlign:'middle',marginRight:'0.4rem'}}/>{c.nom}</td>
                    <td style={{ padding:'1rem 1.2rem' }}><span style={{ backgroundColor:'rgba(139,92,246,0.1)', color:'#8b5cf6', padding:'0.25rem 0.7rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700' }}>{c._count?.materials||0}</span></td>
                    <td style={{ padding:'1rem 1.2rem' }}>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <button onClick={() => openCatModal(c)} style={{ background:'rgba(59,130,246,0.1)', border:'none', color:'#3b82f6', cursor:'pointer', padding:'0.45rem', borderRadius:'6px' }}><Edit size={15}/></button>
                        <button onClick={() => deleteCat(c.id)} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', cursor:'pointer', padding:'0.45rem', borderRadius:'6px' }}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length===0 && <tr><td colSpan="3" style={{padding:'3rem',textAlign:'center',color:'#94a3b8'}}>Aucune catégorie.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Matériel */}
      {showModal && (
        <NouveauMaterielModal 
          onClose={() => setShowModal(false)}
          onSuccess={handleMatSuccess}
          initialData={editingMat}
        />
      )}

      {/* Modal Catégorie */}
      {showCatModal && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(15,23,42,0.75)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', width:'100%', maxWidth:'400px', overflow:'hidden' }}>
            <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center', backgroundColor:'#f8fafc' }}>
              <h2 style={{ margin:0, fontSize:'1.2rem', fontWeight:'700' }}>{editingCatId ? 'Modifier' : 'Nouvelle catégorie'}</h2>
              <button onClick={() => setShowCatModal(false)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleCatSubmit} style={{ padding:'2rem' }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={lS}>Nom <span style={{color:'#ef4444'}}>*</span></label>
                <input required value={catName} onChange={e => setCatName(e.target.value)} style={iS} placeholder="Ex: Équipement de Forage" />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'1rem' }}>
                <button type="button" onClick={() => setShowCatModal(false)} style={{ padding:'0.6rem 1.5rem', borderRadius:'8px', border:'1px solid #cbd5e1', background:'#fff', color:'#475569', fontWeight:'600', cursor:'pointer' }}>Annuler</button>
                <button type="submit" style={{ padding:'0.6rem 1.5rem', borderRadius:'8px', border:'none', backgroundColor:'#FF6B35', color:'#fff', fontWeight:'600', cursor:'pointer' }}>{editingCatId ? 'Mettre à jour' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historique */}
      {showHistory && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(15,23,42,0.75)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'12px', width:'100%', maxWidth:'600px', maxHeight:'70vh', overflow:'auto' }}>
            <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center', backgroundColor:'#f8fafc', position:'sticky', top:0 }}>
              <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:'700' }}>Historique — {showHistory.name}</h2>
              <button onClick={() => setShowHistory(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <p style={{ color:'#64748b', marginBottom:'1rem' }}>Code: <strong>{showHistory.barcode}</strong> | Statut: <Badge status={showHistory.status}/></p>
              {showHistory.transfers?.length > 0 ? showHistory.transfers.map(t => (
                <div key={t.id} style={{ padding:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', marginBottom:'0.8rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <strong>{t.sourceService} → {t.destinationService}</strong>
                    <Badge status={t.status}/>
                  </div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b' }}>
                    Par: {t.requester?.name} | {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                    {t.approver && <> | Validé par: {t.approver.name}</>}
                  </div>
                </div>
              )) : <p style={{color:'#94a3b8',textAlign:'center'}}>Aucun transfert pour ce matériel.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materiels;
