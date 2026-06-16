import React, { useState, useEffect, useRef } from 'react';
import { Package, X, UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { MaterielApi, CentreApi } from '../../services/api.js';

const iS = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid', outline: 'none', fontSize: '0.875rem', backgroundColor: '#fff', color: '#374151', boxSizing: 'border-box' };
const getIs = (isErr) => ({ ...iS, borderColor: isErr ? '#ef4444' : '#e5e7eb' });
const lS = { display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' };
const errS = { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '500' };

const SectionTitle = ({ titre }) => (
  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1.5rem' }}>
    <span style={{ color: '#f97316' }}>▸</span>
    {titre}
  </h3>
);

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
  const fileInputRef = useRef(null);
  
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
    setBarcodeAvailable(null); // reset while checking
    const timer = setTimeout(async () => {
      try {
        const res = await MaterielApi.checkBarcode(form.barcode);
        setBarcodeAvailable(res?.available ?? null);
      } catch (e) { 
        // On network error, don't block the button — just show nothing
        setBarcodeAvailable(null); 
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.barcode]);

  useEffect(() => {
    if (!form.codeInventaire || form.codeInventaire === initialData?.codeInventaire) return;
    setInventaireAvailable(null); // reset while checking
    const timer = setTimeout(async () => {
      try {
        const res = await MaterielApi.checkInventaire(form.codeInventaire);
        setInventaireAvailable(res?.available ?? null);
      } catch (e) { 
        // On network error, don't block the button — just show nothing
        setInventaireAvailable(null); 
      }
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La photo dépasse la taille maximale de 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result }); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = (e) => {
    e.stopPropagation();
    setForm({ ...form, photo: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Group centres by direction
  const groupedCentres = centres.reduce((acc, c) => {
    const dir = c.direction?.nom || 'Autre';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(c);
    return acc;
  }, {});

  const getStatutStyle = (s, isSelected) => {
    if (!isSelected) return { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#6b7280' };
    if (s.color === 'green') return { backgroundColor: '#ecfdf5', borderColor: '#10b981', color: '#047857' };
    if (s.color === 'yellow') return { backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#b45309' };
    if (s.color === 'red') return { backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#b91c1c' };
    return { backgroundColor: '#f3f4f6', borderColor: '#6b7280', color: '#374151' };
  };

  const getEtatStyle = (isSelected) => ({
    flex: 1, padding: '0.625rem 0.75rem', borderRadius: '0.25rem', border: '1px solid', textAlign: 'center', transition: 'all 0.15s', cursor: 'pointer',
    backgroundColor: isSelected ? '#fff7ed' : '#fff',
    borderColor: isSelected ? '#f97316' : '#e5e7eb'
  });

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="#ea580c" /> {isEditing ? 'Modifier matériel' : 'Nouveau matériel'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20}/>
          </button>
        </div>
        
        {/* Body (Scrollable) */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <form id="material-form" onSubmit={handleSubmit}>
            
            {/* Section 1: Identification */}
            <SectionTitle titre="Identification" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={lS}>Code Barre <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} style={{...getIs(errors.barcode), paddingRight: '5rem', fontFamily: 'monospace'}} placeholder="ENTP-EQP-XXXXXX" />
                  {form.barcode && form.barcode !== initialData?.barcode && barcodeAvailable !== null && (
                    <span style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)' }}>
                      {barcodeAvailable ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                    </span>
                  )}
                  <button type="button" onClick={generateBarcode} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '0.75rem', color: '#ea580c', fontWeight: '500', textDecoration: 'underline', cursor: 'pointer' }}>
                    Générer
                  </button>
                </div>
                {errors.barcode && <div style={errS}>{errors.barcode}</div>}
              </div>
              
              <div>
                <label style={lS} title="Numéro d'inventaire interne ENTP">Code Inventaire <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input value={form.codeInventaire} onChange={e => setForm({...form, codeInventaire: e.target.value})} style={{...getIs(errors.codeInventaire), paddingRight: '5rem', fontFamily: 'monospace'}} placeholder="INV-2026-XXXXXX" />
                  {form.codeInventaire && form.codeInventaire !== initialData?.codeInventaire && inventaireAvailable !== null && (
                    <span style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)' }}>
                      {inventaireAvailable ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                    </span>
                  )}
                  <button type="button" onClick={generateInventaire} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '0.75rem', color: '#ea580c', fontWeight: '500', textDecoration: 'underline', cursor: 'pointer' }}>
                    Générer
                  </button>
                </div>
                {errors.codeInventaire && <div style={errS}>{errors.codeInventaire}</div>}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={lS}>Désignation du matériel <span style={{color: '#ef4444'}}>*</span></label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={getIs(errors.name)} placeholder="Ex: Pompe à boue National 12-P-160" />
              {errors.name && <div style={errS}>{errors.name}</div>}
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lS}>Description / Observations</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...getIs(), resize: 'vertical', fontFamily: 'inherit'}} placeholder="Caractéristiques techniques, état général, marque, modèle, numéro de série..." />
            </div>
            
            {/* Section 2: Classification */}
            <SectionTitle titre="Classification" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={lS}>Catégorie <span style={{color: '#ef4444'}}>*</span></label>
                <select value={form.categorie} onChange={e => handleCategoryChange(e.target.value)} style={getIs(errors.categorie)}>
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
                <input value={form.sousCategorie} onChange={e => setForm({...form, sousCategorie: e.target.value})} style={getIs()} placeholder="Ex: Haute pression, Triplex..." />
              </div>
            </div>
            
            {/* Section 3: Localisation */}
            <SectionTitle titre="Localisation" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={lS}>Centre <span style={{color: '#ef4444'}}>*</span></label>
                <select value={form.centreId} onChange={e => setForm({...form, centreId: e.target.value})} style={getIs(errors.centreId)}>
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
                <select value={form.lieuId} onChange={e => setForm({...form, lieuId: e.target.value})} style={{...getIs(), backgroundColor: form.centreId ? '#fff' : '#f9fafb'}} disabled={!form.centreId}>
                  <option value="">Sélectionnez un lieu (optionnel)</option>
                  {lieux.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} ({l.type})</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Section 4: État & Statut */}
            <SectionTitle titre="État & Statut" />
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={lS}>Statut <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { value: "Disponible",     label: "Disponible",      color: "green"  },
                  { value: "En maintenance", label: "En maintenance",  color: "yellow" },
                  { value: "Hors service",   label: "Hors service",    color: "red"    },
                  { value: "Mis en rebut",   label: "Mis en rebut",    color: "gray"   },
                ].map(s => {
                  const isSelected = form.status === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setForm({...form, status: s.value})}
                      type="button"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: isSelected ? '600' : '500', borderRadius: '0.25rem', border: '1px solid', transition: 'all 0.15s', cursor: 'pointer', ...getStatutStyle(s, isSelected) }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              {errors.status && <div style={errS}>{errors.status}</div>}
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lS}>État général <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { value: "Neuf",    label: "Neuf",    desc: "Non utilisé", bar: 4 },
                  { value: "Bon",     label: "Bon",     desc: "Bon état",    bar: 3 },
                  { value: "Usagé",   label: "Usagé",   desc: "Usure normale",bar: 2 },
                  { value: "Dégradé", label: "Dégradé", desc: "Usure avancée",bar: 1 },
                ].map(e => {
                  const isSelected = form.etatGeneral === e.value;
                  return (
                    <button
                      key={e.value}
                      onClick={() => setForm({...form, etatGeneral: e.value})}
                      type="button"
                      style={getEtatStyle(isSelected)}
                    >
                      {/* Barre indicateur */}
                      <div style={{ display: 'flex', gap: '0.125rem', justifyContent: 'center', marginBottom: '0.375rem' }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{ height: '0.25rem', width: '1.25rem', borderRadius: '9999px', backgroundColor: i <= e.bar ? (isSelected ? '#f97316' : '#9ca3af') : '#e5e7eb' }} />
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: isSelected ? '#c2410c' : '#374151' }}>
                        {e.label}
                      </p>
                      <p style={{ margin: 0, marginTop: '0.125rem', fontSize: '0.75rem', color: isSelected ? '#f97316' : '#9ca3af' }}>
                        {e.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.etatGeneral && <div style={errS}>{errors.etatGeneral}</div>}
            </div>
            
            {/* Section 5: Informations Complémentaires */}
            <SectionTitle titre="Informations complémentaires" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={lS}>Marque / Fabricant</label>
                <input value={form.marque} onChange={e => setForm({...form, marque: e.target.value})} style={getIs()} placeholder="Ex: National Oilwell" list="marques-list" />
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
                <input value={form.modele} onChange={e => setForm({...form, modele: e.target.value})} style={getIs()} placeholder="Ex: 12-P-160" />
              </div>
              <div>
                <label style={lS}>N° de Série</label>
                <input value={form.numeroSerie} onChange={e => setForm({...form, numeroSerie: e.target.value})} style={getIs()} placeholder="Numéro de série constructeur" />
              </div>
              <div>
                <label style={lS}>Année de mise en service</label>
                <input type="number" min="1980" max={new Date().getFullYear()} value={form.anneeService} onChange={e => setForm({...form, anneeService: e.target.value})} style={getIs()} placeholder="Ex: 2019" />
              </div>
              <div>
                <label style={lS}>Valeur estimée (DA)</label>
                <input type="number" step="0.01" value={form.valeurEstimee} onChange={e => setForm({...form, valeurEstimee: e.target.value})} style={getIs()} placeholder="Valeur en Dinars Algériens" />
              </div>
            </div>
            
            {/* Section 6: Photo */}
            <SectionTitle titre="Photo (optionnel)" />
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/jpeg, image/png" 
                style={{ display: 'none' }} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '1px dashed #d1d5db', borderRadius: '0.5rem', padding: form.photo ? '1rem' : '2rem', textAlign: 'center', backgroundColor: '#f9fafb', cursor: 'pointer', position: 'relative' }}
              >
                {form.photo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={form.photo} alt="Aperçu" style={{ maxHeight: '150px', borderRadius: '0.375rem', marginBottom: '0.5rem', objectFit: 'contain' }} />
                    <button type="button" onClick={clearPhoto} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={14} />
                    </button>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>✓ Photo sélectionnée</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} color="#9ca3af" style={{ margin: '0 auto 0.5rem auto' }} />
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', color: '#4b5563', fontSize: '0.875rem' }}>📷 Glissez une photo ici ou cliquez pour parcourir</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>JPG, PNG — max 5MB</p>
                  </>
                )}
              </div>
            </div>

          </form>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', backgroundColor: '#f9fafb' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', color: '#4b5563', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}>
            Annuler
          </button>
          <button 
            type="submit" 
            form="material-form" 
            disabled={loading}
            style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: '500', color: '#fff', backgroundColor: loading ? '#94a3b8' : '#ea580c', border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading && <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>}
            {isEditing ? 'Mettre à jour' : 'Enregistrer le matériel'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default NouveauMaterielModal;
