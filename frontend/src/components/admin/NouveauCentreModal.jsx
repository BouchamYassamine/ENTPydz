import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin, Building2, Layers } from 'lucide-react';
import { CentreApi } from '../../services/api';

const directionsData = [
  { code: "DG", nom: "Direction Générale", branche: "Direction Générale" },
  { code: "DFO", nom: "Direction Forage", branche: "Opérations" },
  { code: "DWO", nom: "Direction Workover", branche: "Opérations" },
  { code: "DUET", nom: "Unité Équipements Tubulaires", branche: "Opérations" },
  { code: "DTR", nom: "Direction Transport", branche: "Logistique" },
  { code: "DMP", nom: "Direction Maintenance Pétrolière", branche: "Logistique" },
  { code: "DAGS", nom: "Direction Approvisionnements & Stocks", branche: "Logistique" },
  { code: "DHMC", nom: "Direction Hôtellerie & Moyens Communs", branche: "Logistique" },
  { code: "DPE", nom: "Direction Patrimoine & Équipements", branche: "Logistique" },
  { code: "DFC", nom: "Direction Finances & Comptabilité", branche: "Admin & Finances" },
  { code: "DRH", nom: "Direction Ressources Humaines", branche: "Admin & Finances" },
  { code: "CFE", nom: "Centre de Formation et d'Enseignement", branche: "Admin & Finances" },
  { code: "DTIC", nom: "Direction Technologies de l'Information", branche: "Admin & Finances" },
  { code: "DAG", nom: "Direction Affaires Générales", branche: "Admin & Finances" }
];

const cityWilayaMap = {
  "Hassi Messaoud": "Ouargla (30)",
  "Ouargla": "Ouargla (30)",
  "Alger": "Alger (16)",
  "Bab Ezzouar": "Alger (16)",
  "Illizi": "Illizi (33)",
  "In Amenas": "Illizi (33)",
  "Laghouat": "Laghouat (03)",
  "Hassi R'Mel": "Laghouat (03)",
  "In Salah": "Tamanrasset (11)",
  "Tamanrasset": "Tamanrasset (11)",
  "Ghardaïa": "Ghardaïa (47)",
  "Constantine": "Constantine (25)",
  "Oran": "Oran (31)"
};

const directionToCities = {
  DG: "Hassi Messaoud", DFO: "Hassi Messaoud", DWO: "Hassi Messaoud", DUET: "Hassi Messaoud",
  DTR: "Hassi Messaoud", DMP: "Hassi Messaoud", DAGS: "Hassi Messaoud", DHMC: "Hassi Messaoud",
  DPE: "Hassi Messaoud", DFC: "Hassi Messaoud", DRH: "Hassi Messaoud", CFE: "Hassi Messaoud",
  DTIC: "Hassi Messaoud", DAG: "Hassi Messaoud"
};

const centreSuggestions = {
  DG: ["Base Industrielle du 20 Août 1955", "Bureau de Liaison Alger"],
  DFO: ["Base Forage HMD", "Base Forage Tin Fouyé"],
  DWO: ["Base Workover HMD", "Base Workover Hassi R'Mel"],
  DUET: ["Unité Équipements Tubulaires HMD"],
  DTR: ["Parc Transport HMD", "Parc Transport Ouargla"],
  DMP: ["Base Maintenance HMD", "Base Maintenance In Amenas", "Base Maintenance In Salah"],
  DAGS: ["Magasin Central HMD", "Magasin Logistique Ouargla"],
  DHMC: ["Camp de Vie HMD", "Camp de Vie Ouargla"],
  DPE: ["Dépôt Patrimoine HMD"],
  DFC: ["Bureau DFC HMD", "Bureau DFC Alger"],
  DRH: ["Bureau DRH HMD"],
  CFE: ["Centre de Formation HMD"],
  DTIC: ["Centre Informatique HMD"],
  DAG: ["Bureau DAG HMD"]
};

const lieuSuggestions = {
  DFO: ["Atelier Forage", "Magasin Pièces", "Salle Opérations", "Atelier Électrique", "Dépôt Tubulaires", "Camp de Vie"],
  DWO: ["Atelier Forage", "Magasin Pièces", "Salle Opérations", "Atelier Électrique", "Dépôt Tubulaires", "Camp de Vie"],
  DMP: ["Atelier Mécanique", "Atelier Soudure HP", "Atelier Électro-Froid", "Atelier Instrumentation", "Magasin Maintenance"],
  DAGS: ["Zone Stockage A", "Zone Stockage B", "Bureau Réception", "Bureau Expédition", "Dépôt Dangereux", "Quai Chargement"],
  DTR: ["Garage Principal", "Atelier Mécanique", "Atelier Électrique", "Magasin Pièces Auto"],
  DUET: ["Atelier Inspection", "Atelier Réparation", "Magasin Tubulaires", "Laboratoire"],
  DHMC: ["Réfectoire", "Hébergement", "Buanderie", "Infirmerie", "Salle Sport"],
  DG: ["Bureau Direction", "Salle de Réunion", "Secrétariat", "Bureau HSE"],
  DAG: ["Bureau Direction", "Salle de Réunion", "Secrétariat", "Bureau HSE"],
  DRH: ["Bureau Paie", "Bureau Formation", "Salle de Formation", "Atelier Pratique", "Bibliothèque"],
  CFE: ["Bureau Paie", "Bureau Formation", "Salle de Formation", "Atelier Pratique", "Bibliothèque"],
  DTIC: ["Salle Serveurs", "Bureau Support", "Bureau Développement"],
};
const defaultLieux = ["Bureau", "Magasin", "Atelier", "Salle de Réunion"];

export default function NouveauCentreModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    directionCode: '', nom: '', ville: '', wilaya: '', adresse: '', lieux: []
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle mapping Wilaya when Ville changes
  useEffect(() => {
    if (formData.ville && cityWilayaMap[formData.ville]) {
      setFormData(prev => ({ ...prev, wilaya: cityWilayaMap[prev.ville] }));
    } else if (!cityWilayaMap[formData.ville]) {
      // Pour les saisies libres non mappées
      setFormData(prev => ({ ...prev, wilaya: '' }));
    }
  }, [formData.ville]);

  const handleDirectionChange = (code) => {
    const autoCity = directionToCities[code] || "";
    setFormData(prev => ({ 
      ...prev, 
      directionCode: code,
      ville: autoCity,
      wilaya: cityWilayaMap[autoCity] || "",
      nom: '' // reset nom
    }));
  };

  const addLieu = () => {
    setFormData(prev => ({
      ...prev,
      lieux: [...prev.lieux, { nom: '', type: 'Bureau' }]
    }));
  };

  const updateLieu = (index, field, value) => {
    const newLieux = [...formData.lieux];
    newLieux[index][field] = value;
    setFormData(prev => ({ ...prev, lieux: newLieux }));
  };

  const removeLieu = (index) => {
    setFormData(prev => ({
      ...prev,
      lieux: prev.lieux.filter((_, i) => i !== index)
    }));
  };

  const isValid = formData.directionCode && formData.nom.length >= 3 && formData.ville;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await CentreApi.createCentre(formData);
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur de création du centre');
      setLoading(false);
    }
  };

  // Group directions
  const groupedDirections = directionsData.reduce((acc, dir) => {
    if (!acc[dir.branche]) acc[dir.branche] = [];
    acc[dir.branche].push(dir);
    return acc;
  }, {});

  const currentCentreSuggestions = formData.directionCode ? (centreSuggestions[formData.directionCode] || []) : [];
  const currentLieuSuggestions = formData.directionCode ? (lieuSuggestions[formData.directionCode] || defaultLieux) : defaultLieux;

  const inputStyle = { width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s', backgroundColor: '#fff' };
  const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: '#334155' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px rgba(0,0,0,0.15)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.2rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={22} color="#E05A1E" />
            Nouveau centre
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          <form id="new-centre-form" onSubmit={handleSubmit}>
            
            {/* 1. DIRECTION */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Direction <span style={{color:'#ef4444'}}>*</span></label>
              <select 
                required
                value={formData.directionCode}
                onChange={e => handleDirectionChange(e.target.value)}
                style={{...inputStyle, ':focus': { borderColor: '#E05A1E' }}}
              >
                <option value="">Sélectionnez une direction</option>
                {Object.entries(groupedDirections).map(([branche, dirs]) => (
                  <optgroup key={branche} label={branche}>
                    {dirs.map(d => (
                      <option key={d.code} value={d.code}>{d.code} - {d.nom}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 2. NOM DU CENTRE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Nom du centre <span style={{color:'#ef4444'}}>*</span></label>
              <input 
                required 
                list="centre-suggestions"
                value={formData.nom} 
                onChange={e => setFormData({...formData, nom: e.target.value})} 
                style={inputStyle} 
                placeholder="Ex: Base Forage HMD" 
              />
              <datalist id="centre-suggestions">
                {currentCentreSuggestions.map(s => <option key={s} value={s} />)}
              </datalist>
              {formData.nom.length > 0 && formData.nom.length < 3 && (
                 <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}>Minimum 3 caractères.</div>
              )}
            </div>

            {/* 3. VILLE et 4. WILAYA */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>Ville <span style={{color:'#ef4444'}}>*</span></label>
                <input 
                  required 
                  list="ville-suggestions"
                  value={formData.ville} 
                  onChange={e => setFormData({...formData, ville: e.target.value})} 
                  style={inputStyle} 
                  placeholder="Sélectionnez ou tapez..." 
                />
                <datalist id="ville-suggestions">
                  {Object.keys(cityWilayaMap).map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Wilaya</label>
                <input 
                  readOnly 
                  value={formData.wilaya} 
                  style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} 
                  placeholder="Auto..."
                />
              </div>
            </div>

            {/* 5. ADRESSE */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Adresse <span style={{color:'#94a3b8', fontWeight:'normal'}}>(optionnel)</span></label>
              <textarea 
                value={formData.adresse} 
                onChange={e => setFormData({...formData, adresse: e.target.value})} 
                rows={2} 
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} 
                placeholder="Adresse complète..." 
              />
            </div>

            {/* 6. LIEUX DU CENTRE */}
            <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>Lieux du centre</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ajoutez les espaces physiques de ce centre</span>
                </div>
                <button 
                  type="button" 
                  onClick={addLieu} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #E05A1E', backgroundColor: '#fff', color: '#E05A1E', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Ajouter un lieu
                </button>
              </div>

              {formData.lieux.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>Aucun lieu ajouté. Ce n'est pas obligatoire.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {formData.lieux.map((lieu, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <input 
                          list={`lieu-sug-${idx}`} 
                          value={lieu.nom} 
                          onChange={(e) => updateLieu(idx, 'nom', e.target.value)} 
                          placeholder="Nom du lieu..."
                          style={inputStyle} 
                          required
                        />
                        <datalist id={`lieu-sug-${idx}`}>
                          {currentLieuSuggestions.map(s => <option key={s} value={s} />)}
                        </datalist>
                      </div>
                      <div style={{ width: '140px' }}>
                        <select 
                          value={lieu.type} 
                          onChange={(e) => updateLieu(idx, 'type', e.target.value)}
                          style={inputStyle}
                        >
                          {["Atelier", "Magasin", "Bureau", "Dépôt", "Camp", "Chantier", "Laboratoire", "Salle"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeLieu(idx)} 
                        style={{ padding: '0.65rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errorMsg && (
              <div style={{ marginTop: '1.5rem', padding: '0.8rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#1e293b', fontWeight: '700', cursor: 'pointer' }}
          >
            Annuler
          </button>
          <button 
            form="new-centre-form"
            type="submit" 
            disabled={!isValid || loading}
            style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#E05A1E', color: '#fff', fontWeight: '700', cursor: (!isValid || loading) ? 'not-allowed' : 'pointer', opacity: (!isValid || loading) ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

      </div>
    </div>
  );
}
