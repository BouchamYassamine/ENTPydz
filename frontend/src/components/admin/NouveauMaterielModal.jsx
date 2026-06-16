import React, { useState, useEffect, useCallback } from 'react';
import { Package, X, RefreshCw, UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { MaterielApi, CentreApi } from '../../services/api.js';

const iS = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', backgroundColor: '#fff', transition: 'border-color 0.2s' };
const lS = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' };
const errS = { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', fontWeight: '500' };

const CATEGORIES = [
  { group: 'Équipements de Forage', items: [{ nom: 'Appareil de Forage', code: 'FOR' }, { nom: 'Pompe à Boue', code: 'PMB' }, { nom: 'Tête d\'Injection', code: 'TDI' }, { nom: 'Table de Rotation', code: 'TDR' }, { nom: 'Moteur de Boue', code: 'MTB' }, { nom: 'BOP / Équipements Sécurité', code: 'BOP' }, { nom: 'Tiges de Forage', code: 'TDF' }, { nom: 'Tubulaires / Cuvelage', code: 'TUB' }, { nom: 'Trépans / Outils de Fond', code: 'TRE' }] },
  { group: 'Équipements Workover', items: [{ nom: 'Unité Workover', code: 'WOU' }, { nom: 'Équipements Complétion', code: 'CPL' }] },
  { group: 'Matériel Mécanique', items: [{ nom: 'Compresseur', code: 'CMP' }, { nom: 'Groupe Électrogène', code: 'GEL' }, { nom: 'Grue / Engin de Levage', code: 'GRU' }, { nom: 'Véhicule / Engin Transport', code: 'VEH' }, { nom: 'Pompe Hydraulique', code: 'PHY' }] },
  { group: 'Matériel Électrique', items: [{ nom: 'Tableau Électrique', code: 'ELC' }, { nom: 'Câble / Équipement Électrique', code: 'CAB' }, { nom: 'Moteur Électrique', code: 'MEL' }] },
  { group: 'Instrumentation', items: [{ nom: 'Équipement de Mesure', code: 'MES' }, { nom: 'Instrumentation / Capteurs', code: 'INS' }] },
  { group: 'Outillage & Consommables', items: [{ nom: 'Outillage Général', code: 'OUT' }, { nom: 'Pièces de Rechange', code: 'PDR' }, { nom: 'Consommables', code: 'CON' }] },
  { group: 'Autres', items: [{ nom: 'Matériel Informatique', code: 'INF' }, { nom: 'Mobilier / Équipement Bureau', code: 'MOB' }, { nom: 'Autre', code: 'AUT' }] }
];

const NouveauMaterielModal = ({ onClose, onSuccess, initialData = null }) => {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [centres, setCentres] = useState([]);
  const [lieux, setLieux] = useState([]);
  
  const [form, setForm] = useState({
    barcode: '',
    codeInventaire: '',
    name: '',
    description: '',
    categorie: '',
    sousCategorie: '',
    centreId: '',
    lieuId: '',
    status: 'Disponible',
    etatGeneral: 'Bon',
    marque: '',
    modele: '',
    numeroSerie: '',
    anneeService: '',
    valeurEstimee: '',
    photo: ''
  });

  const [errors, setErrors] = useState({});
  const [barcodeAvailable, setBarcodeAvailable] = useState(null);
  const [inventaireAvailable, setInventaireAvailable] = useState(null);
  
  useEffect(() => {
    fetchCentres();
    if (initialData) {
      setForm({
        ...initialData,
        categorie: initialData.categorie || '',
        centreId: initialData.centreId || '',
        lieuId: initialData.lieuId || '',
        anneeService: initialData.anneeService || '',
        valeurEstimee: initialData.valeurEstimee || ''
      });
      // Skip validation on initial load for editing
      setBarcodeAvailable(true);
      setInventaireAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (form.centreId) {
      fetchLieux(form.centreId);
    } else {
      setLieux([]);
    }
  }, [form.centreId]);

  const fetchCentres = async () => {
    try {
      const res = await CentreApi.getCentres();
      if (res.success) setCentres(res.data);
    } catch (err) {}
  };

  const fetchLieux = async (centreId) => {
    try {
      const res = await CentreApi.getCentreLieux(centreId);
      if (res.success) setLieux(res.data);
    } catch (err) {}
  };

  // Debounced API checks
  useEffect(() => {
    if (!form.barcode || form.barcode === initialData?.barcode) return;
    const timer = setTimeout(async () => {
      try {
        const res = await MaterielApi.checkBarcode(form.barcode);
        setBarcodeAvailable(res.data?.available);
      } catch (e) { setBarcodeAvailable(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.barcode]);

  useEffect(() => {
    if (!form.codeInventaire || form.codeInventaire === initialData?.codeInventaire) return;
    const timer = setTimeout(async () => {
      try {
        const res = await MaterielApi.checkInventaire(form.codeInventaire);
        setInventaireAvailable(res.data?.available);
      } catch (e) { setInventaireAvailable(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.codeInventaire]);

  const generateBarcode = () => {
    let catCode = 'EQP';
    if (form.categorie) {
      for (const group of CATEGORIES) {
        const item = group.items.find(i => i.nom === form.categorie);
        if (item) catCode = item.code;
      }
    }
    const rand = Math.floor(Math.random() * 900000) + 100000;
    setForm(prev => ({ ...prev, barcode: `ENTP-${catCode}-${rand}` }));
  };

  const generateInventaire = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900000) + 100000;
    setForm(prev => ({ ...prev, codeInventaire: `INV-${year}-${rand}` }));
  };

  // Generate automatically when category changes
  const handleCategoryChange = (val) => {
    setForm(prev => ({ ...prev, categorie: val }));
    setTimeout(() => {
      let catCode = 'EQP';
      for (const group of CATEGORIES) {
        const item = group.items.find(i => i.nom === val);
        if (item) catCode = item.code;
      }
      const rand = Math.floor(Math.random() * 900000) + 100000;
      setForm(p => ({ ...p, barcode: `ENTP-${catCode}-${rand}` }));
    }, 50);
  };

  const validate = () => {
    const newErrs = {};
    if (!form.barcode) newErrs.barcode = "Le code barre est requis.";
    if (barcodeAvailable === false) newErrs.barcode = "Ce code barre est déjà utilisé.";
    if (!form.codeInventaire) newErrs.codeInventaire = "Le code inventaire est requis.";
    if (inventaireAvailable === false) newErrs.codeInventaire = "Ce code inventaire est déjà utilisé.";
    if (!form.name || form.name.length < 3) newErrs.name = "La désignation doit contenir au moins 3 caractères.";
    if (!form.categorie) newErrs.categorie = "La catégorie est requise.";
    if (!form.centreId) newErrs.centreId = "Le centre est requis.";
    if (!form.status) newErrs.status = "Le statut est requis.";
    if (!form.etatGeneral) newErrs.etatGeneral = "L'état général est requis.";
    
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    try {
      if (isEditing) {
        await MaterielApi.updateMateriel(initialData.id, form);
      } else {
        await MaterielApi.createMateriel(form);
      }
      onSuccess();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...iS,
    borderColor: errors[field] ? '#ef4444' : '#cbd5e1'
  });

  const sectionStyle = {
    backgroundColor: '#f8fafc',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    color: '#0f172a',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderLeft: '4px solid #E05A1E'
  };

  // Group centres by direction
  const groupedCentres = centres.reduce((acc, c) => {
    const dir = c.direction?.nom || 'Autre';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(c);
    return acc;
  }, {});

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="#E05A1E" /> {isEditing ? 'Modifier matériel' : 'Nouveau matériel'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20}/></button>
        </div>
        
        {/* Body (Scrollable) */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <form id="material-form" onSubmit={handleSubmit}>
            
            {/* Section 1: Identification */}
            <div style={sectionStyle}>Identification</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={lS}>Code Barre <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} style={{...inputStyle('barcode'), paddingRight: '2.5rem', fontFamily: 'monospace', fontWeight: '600', color: '#334155'}} placeholder="ENTP-EQP-XXXXXX" />
                    {form.barcode && form.barcode !== initialData?.barcode && barcodeAvailable !== null && (
                      <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                        {barcodeAvailable ? <CheckCircle size={18} color="#16a34a" /> : <XCircle size={18} color="#ef4444" />}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={generateBarcode} style={{ padding: '0 0.8rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600', color: '#475569' }}>
                    <RefreshCw size={14}/>
                  </button>
                </div>
                {errors.barcode && <div style={errS}>{errors.barcode}</div>}
              </div>
              
              <div>
                <label style={lS}>Code Inventaire <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }} title="Numéro d'inventaire interne ENTP">
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input value={form.codeInventaire} onChange={e => setForm({...form, codeInventaire: e.target.value})} style={{...inputStyle('codeInventaire'), paddingRight: '2.5rem', fontFamily: 'monospace', fontWeight: '600', color: '#334155'}} placeholder="INV-2026-XXXXXX" />
                    {form.codeInventaire && form.codeInventaire !== initialData?.codeInventaire && inventaireAvailable !== null && (
                      <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                        {inventaireAvailable ? <CheckCircle size={18} color="#16a34a" /> : <XCircle size={18} color="#ef4444" />}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={generateInventaire} style={{ padding: '0 0.8rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600', color: '#475569' }}>
                    <RefreshCw size={14}/>
                  </button>
                </div>
                {errors.codeInventaire && <div style={errS}>{errors.codeInventaire}</div>}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={lS}>Désignation du matériel <span style={{color: '#ef4444'}}>*</span></label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle('name')} placeholder="Ex: Pompe à boue National 12-P-160" />
              {errors.name && <div style={errS}>{errors.name}</div>}
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={lS}>Description / Observations</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...iS, resize: 'vertical', fontFamily: 'inherit'}} placeholder="Caractéristiques techniques, état général, marque, modèle, numéro de série..." />
            </div>
            
            {/* Section 2: Classification */}
            <div style={sectionStyle}>Classification</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={lS}>Catégorie <span style={{color: '#ef4444'}}>*</span></label>
                <select value={form.categorie} onChange={e => handleCategoryChange(e.target.value)} style={inputStyle('categorie')}>
                  <option value="">Sélectionnez une catégorie...</option>
                  {CATEGORIES.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map(item => (
                        <option key={item.nom} value={item.nom}>{item.nom}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.categorie && <div style={errS}>{errors.categorie}</div>}
              </div>
              <div>
                <label style={lS}>Sous-catégorie</label>
                <input value={form.sousCategorie} onChange={e => setForm({...form, sousCategorie: e.target.value})} style={iS} placeholder="Ex: Haute pression, Triplex..." />
              </div>
            </div>
            
            {/* Section 3: Localisation */}
            <div style={sectionStyle}>Localisation</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={lS}>Centre <span style={{color: '#ef4444'}}>*</span></label>
                <select value={form.centreId} onChange={e => setForm({...form, centreId: e.target.value})} style={inputStyle('centreId')}>
                  <option value="">Sélectionnez un centre...</option>
                  {Object.entries(groupedCentres).map(([dir, ctrs]) => (
                    <optgroup key={dir} label={dir}>
                      {ctrs.map(c => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.centreId && <div style={errS}>{errors.centreId}</div>}
              </div>
              <div>
                <label style={lS}>Lieu dans le centre</label>
                <select value={form.lieuId} onChange={e => setForm({...form, lieuId: e.target.value})} style={iS} disabled={!form.centreId}>
                  <option value="">Sélectionnez un lieu (optionnel)</option>
                  {lieux.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} ({l.type})</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Section 4: État & Statut */}
            <div style={sectionStyle}>État & Statut</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lS}>Statut <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Disponible', 'En maintenance', 'En transfert', 'Hors service', 'Mis en rebut'].map(s => {
                  const isSelected = form.status === s;
                  const isDisabled = s === 'En transfert' && !isEditing;
                  
                  let color = '#64748b', bg = '#f1f5f9', border = '#cbd5e1';
                  if (isSelected) {
                    border = '#E05A1E';
                    bg = '#FDF2ED';
                    color = '#C94D18';
                  }
                  
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setForm({...form, status: s})}
                      style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: `2px solid ${border}`, backgroundColor: bg, color, fontWeight: '700', fontSize: '0.85rem', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, transition: 'all 0.2s' }}
                    >
                      {s === 'Disponible' && '🟢 '}
                      {s === 'En maintenance' && '🟡 '}
                      {s === 'En transfert' && '🔵 '}
                      {s === 'Hors service' && '🔴 '}
                      {s === 'Mis en rebut' && '⚫ '}
                      {s}
                    </button>
                  );
                })}
              </div>
              {errors.status && <div style={errS}>{errors.status}</div>}
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={lS}>État général <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Neuf', 'Bon', 'Usagé', 'Dégradé'].map(e => {
                  const isSelected = form.etatGeneral === e;
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm({...form, etatGeneral: e})}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `2px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`, backgroundColor: isSelected ? '#eff6ff' : '#fff', color: isSelected ? '#1d4ed8' : '#475569', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      {e === 'Neuf' && '⭐⭐⭐⭐ '}
                      {e === 'Bon' && '⭐⭐⭐ '}
                      {e === 'Usagé' && '⭐⭐ '}
                      {e === 'Dégradé' && '⭐ '}
                      {e}
                    </button>
                  );
                })}
              </div>
              {errors.etatGeneral && <div style={errS}>{errors.etatGeneral}</div>}
            </div>
            
            {/* Section 5: Informations Complémentaires */}
            <div style={sectionStyle}>Informations complémentaires</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={lS}>Marque / Fabricant</label>
                <input value={form.marque} onChange={e => setForm({...form, marque: e.target.value})} style={iS} placeholder="Ex: National Oilwell" list="marques-list" />
                <datalist id="marques-list">
                  <option value="National Oilwell Varco (NOV)" />
                  <option value="Schlumberger" />
                  <option value="Halliburton" />
                  <option value="Baker Hughes" />
                  <option value="Atlas Copco" />
                  <option value="Caterpillar" />
                  <option value="Cummins" />
                </datalist>
              </div>
              <div>
                <label style={lS}>Modèle / Référence</label>
                <input value={form.modele} onChange={e => setForm({...form, modele: e.target.value})} style={iS} placeholder="Ex: 12-P-160" />
              </div>
              <div>
                <label style={lS}>N° de Série</label>
                <input value={form.numeroSerie} onChange={e => setForm({...form, numeroSerie: e.target.value})} style={iS} placeholder="Numéro de série constructeur" />
              </div>
              <div>
                <label style={lS}>Année de mise en service</label>
                <input type="number" min="1980" max={new Date().getFullYear()} value={form.anneeService} onChange={e => setForm({...form, anneeService: e.target.value})} style={iS} placeholder="Ex: 2019" />
              </div>
              <div>
                <label style={lS}>Valeur estimée (DA)</label>
                <input type="number" step="0.01" value={form.valeurEstimee} onChange={e => setForm({...form, valeurEstimee: e.target.value})} style={iS} placeholder="Valeur en Dinars Algériens" />
              </div>
            </div>
            
            {/* Section 6: Photo */}
            <div style={sectionStyle}>Photo (optionnel)</div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#E05A1E'} onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
                <UploadCloud size={32} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#334155' }}>📷 Glissez une photo ici ou cliquez pour parcourir</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>JPG, PNG — max 5MB</p>
              </div>
            </div>

          </form>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f8fafc' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
            Annuler
          </button>
          <button 
            type="submit" 
            form="material-form" 
            disabled={loading || barcodeAvailable === false || inventaireAvailable === false}
            style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#E05A1E', color: '#fff', fontWeight: '700', cursor: (loading || barcodeAvailable === false || inventaireAvailable === false) ? 'not-allowed' : 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (loading || barcodeAvailable === false || inventaireAvailable === false) ? 0.6 : 1 }}
          >
            {loading ? <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/> : <Package size={18}/>}
            {isEditing ? 'Mettre à jour' : 'Enregistrer le matériel'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default NouveauMaterielModal;
