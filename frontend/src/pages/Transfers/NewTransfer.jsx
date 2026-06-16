import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransferApi, MaterielApi, CentreApi } from '../../services/api.js';
import useAuth from '../../hooks/useAuth.js';
import { RefreshCw, ArrowLeft, AlertTriangle, Building2, Calendar, Hash, FileText } from 'lucide-react';
import BonTransfertPrint from '../../components/transfers/BonTransfertPrint.jsx';

import MaterialSelect from '../../components/transfers/MaterialSelect.jsx';
import CentreRecepteurSelect from '../../components/transfers/CentreRecepteurSelect.jsx';
import UrgencySelector from '../../components/transfers/UrgencySelector.jsx';
import TransferRecapCard from '../../components/transfers/TransferRecapCard.jsx';
import SuccessScreen from '../../components/transfers/SuccessScreen.jsx';

const NewTransfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [materials, setMaterials] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorLoad, setErrorLoad] = useState(null);
  
  const [formData, setFormData] = useState({ 
    materialId: '', 
    destinationCentreId: '', 
    quantity: 1,
    motif: '',
    observations: '',
    urgency: 'Normal'
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null); // { numero: 'BT-2026-0042' }

  // Variables pour le récap
  const selectedMaterial = materials.find(m => m.id === parseInt(formData.materialId));
  const selectedDestination = centres.find(c => c.id === parseInt(formData.destinationCentreId));
  const todayDate = new Date().toLocaleDateString('fr-FR');
  const tempNumero = `BT-${new Date().getFullYear()}-XXXX`;

  // Formulaire complet = bouton PDF actif avant soumission
  const isFormReady =
    !!formData.destinationCentreId &&
    !!formData.materialId &&
    formData.motif.trim().length >= 10;

  // Génération PDF : brouillon avant soumission, officiel après
  const handlePrint = () => {
    window.print();
  };

  const printData = successData || {
    numero: tempNumero,
    status: 'Brouillon',
    urgency: formData.urgency,
    quantity: formData.quantity,
    motif: formData.motif,
    observations: formData.observations,
    requestedAt: new Date().toISOString(),
    sourceCentre: user?.centre,
    destinationCentre: selectedDestination,
    material: selectedMaterial,
    requester: { name: user?.name }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    setErrorLoad(null);
    try {
      const [mRes, cRes] = await Promise.all([
        MaterielApi.getMateriels({ centreId: user.centreId }),
        CentreApi.getCentres({ exclude: user.centreId })
      ]);
      
      if (mRes.success) setMaterials(mRes.data);
      if (cRes.success) {
        // Au cas où exclude ne marche pas parfaitement
        setCentres(cRes.data.filter(c => c.id !== user.centreId));
      }
    } catch (err) {
      console.error(err);
      setErrorLoad("Impossible de charger les données nécessaires au transfert.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.centreId) {
      fetchInitialData();
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.materialId) newErrors.materialId = "Veuillez sélectionner un matériel";
    if (!formData.destinationCentreId) newErrors.destinationCentreId = "Veuillez sélectionner un centre de destination";
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = "La quantité doit être au moins 1";
    if (!formData.motif || formData.motif.trim().length < 10) newErrors.motif = "Le motif doit contenir au moins 10 caractères";
    
    setErrors(newErrors);
    
    // Scroll au premier élément en erreur
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const res = await TransferApi.createTransfert(formData);
      if (res.success) {
        setSuccessData(res.data);
      }
    } catch (err) {
      console.error(err);
      setErrors({ global: err.response?.data?.message || "Erreur lors de la création du transfert" });
      const el = document.getElementById('form-top');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      materialId: '',
      destinationCentreId: '',
      quantity: 1,
      motif: '',
      observations: '',
      urgency: 'Normal'
    });
    setSuccessData(null);
    setErrors({});
  };

  if (successData) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <SuccessScreen 
          transfer={successData} 
          onNewTransfer={resetForm} 
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* En-tête Institutionnel ENTP */}
      <div style={{ backgroundColor: '#2C3E50', color: '#fff', padding: '1.25rem 2rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={32} color="#E05A1E" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Entreprise Nationale des Travaux aux Puits</h1>
          <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.25rem', fontWeight: '500' }}>Système de Gestion Logistique - Formulaire Officiel</div>
        </div>
      </div>

      {/* Navigation & Stepper */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <div>
          <button onClick={() => navigate('/transfers')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '600', padding: 0 }}>
            <ArrowLeft size={16} /> Accueil &gt; Transferts &gt; Nouveau Transfert
          </button>
          <h2 style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Initier un Transfert</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ color: '#E05A1E', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E05A1E', color: '#fff', fontSize: '0.7rem' }}>1</span>
            Informations matériel
          </div>
          <div style={{ color: '#94A3B8', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E2E8F0', color: '#64748B', fontSize: '0.7rem' }}>2</span>
            Destinataire
          </div>
          <div style={{ color: '#94A3B8', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E2E8F0', color: '#64748B', fontSize: '0.7rem' }}>3</span>
            Validation finale
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} id="form-top">
        
        {/* Colonne Gauche : Formulaire (65%) */}
        <div style={{ flex: '1 1 600px', backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #2C3E50' }}>
            <FileText size={20} color="#2C3E50" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2C3E50', margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Détails du transfert</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>Renseignez les informations du bon de transfert ENTP</p>
            </div>
          </div>

          {errorLoad && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <AlertTriangle size={24} color="#EF4444" />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#991B1B', fontWeight: '700', fontSize: '0.9rem' }}>Impossible de charger les données</div>
                <div style={{ color: '#B91C1C', fontSize: '0.8rem' }}>{errorLoad}</div>
              </div>
              <button onClick={fetchInitialData} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fff', border: '1px solid #FECACA', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: '#B91C1C' }}>
                Réessayer
              </button>
            </div>
          )}

          {errors.global && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#EF4444', fontWeight: '500', fontSize: '0.9rem', border: '1px solid #FECACA' }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section A — Référence du bon */}
            <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', backgroundColor: '#2C3E50', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>A</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Référence &amp; Identification</span>
            </div>
            {/* 1. N° et 2. Date */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                  N° BON DE TRANSFERT
                </label>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontWeight: '700', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  <Hash size={16} /> {tempNumero} <span style={{ fontSize: '0.7rem', fontWeight: '400', fontStyle: 'italic', fontFamily: 'inherit' }}>(auto-assigné)</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                  DATE DE DEMANDE
                </label>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontWeight: '600', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> {todayDate}
                </div>
              </div>
            </div>

            {/* Section B — Localisation */}
            <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', backgroundColor: '#2C3E50', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>B</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Localisation — Origine &amp; Destination</span>
            </div>
            {/* 3. Centre émetteur */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                CENTRE ÉMETTEUR (auto)
              </label>
              {!user?.centreId ? (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <AlertTriangle size={20} color="#EF4444" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#991B1B', fontSize: '0.9rem' }}>⚠ Votre compte n'est pas associé à un centre.</div>
                    <div style={{ fontSize: '0.8rem', color: '#B91C1C', marginTop: '0.2rem' }}>Contactez l'administrateur pour associer votre compte à un centre.</div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <div style={{ marginTop: '2px' }}><Building2 size={20} color="#9CA3AF" /></div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#374151', fontSize: '1rem' }}>{user?.centre?.nom || 'Votre centre'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.2rem' }}>
                        {user?.centre?.direction?.nom || user?.direction?.nom || 'Direction'} • {user?.centre?.ville || 'Ville'}
                      </div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FDF2ED', color: '#E05A1E', fontSize: '0.75rem', fontWeight: '700', padding: '4px 8px', borderRadius: '12px' }}>
                    ● Votre site
                  </div>
                </div>
              )}
            </div>

            {/* 4. Centre récepteur */}
            <div id="field-destinationCentreId" style={{ marginBottom: '2.5rem' }}>
              <CentreRecepteurSelect 
                centres={centres} 
                selectedId={formData.destinationCentreId} 
                onChange={(id) => setFormData({...formData, destinationCentreId: id})}
                error={errors.destinationCentreId}
              />
            </div>

            {/* Section C — Matériel */}
            <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', backgroundColor: '#2C3E50', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>C</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Matériel &amp; Quantité</span>
            </div>
            {/* 5. Matériel */}
            <div id="field-materialId" style={{ marginBottom: '2rem' }}>
              <MaterialSelect 
                materials={materials} 
                selectedId={formData.materialId} 
                onChange={(id) => setFormData({...formData, materialId: id})}
                error={errors.materialId}
              />
            </div>

            {/* 6. Quantité */}
            <div id="field-quantity" style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                QUANTITÉ À TRANSFÉRER <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', width: '200px' }}>
                <input 
                  type="number" 
                  min="1" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', paddingRight: '40px', border: `1px solid ${errors.quantity ? '#EF4444' : '#E5E7EB'}`, borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: '0.85rem' }}>
                  Unité
                </span>
              </div>
              {errors.quantity && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: '500' }}>{errors.quantity}</div>}
            </div>

            {/* Section D — Justification */}
            <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', backgroundColor: '#2C3E50', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>D</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Justification &amp; Observations</span>
            </div>
            {/* 7. Motif */}
            <div id="field-motif" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                MOTIF DU TRANSFERT <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>Minimum 10 caractères — Expliquez la raison opérationnelle du transfert</div>
              <textarea 
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                placeholder="Ex: Besoin urgent sur chantier Forage Nord..."
                style={{ width: '100%', padding: '0.8rem', border: `1px solid ${errors.motif ? '#EF4444' : '#E5E7EB'}`, borderRadius: '8px', fontSize: '0.95rem', minHeight: '100px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                maxLength={300}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                {errors.motif ? (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: '500' }}>{errors.motif}</span>
                ) : (
                  <span></span>
                )}
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500' }}>{formData.motif.length} / 300</span>
              </div>
            </div>

            {/* 8. Observations */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: '#475569', letterSpacing: '0.03em' }}>
                OBSERVATIONS <span style={{ color: '#94A3B8', fontWeight: '400', textTransform: 'none', letterSpacing: 'normal', fontSize: '0.75rem' }}>(optionnel)</span>
              </label>
              <textarea 
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                placeholder="Informations complémentaires, état du matériel, recommandations de transport..."
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Section E — Criticité */}
            <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', backgroundColor: '#E05A1E', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>E</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Niveau de Criticité — HSE / Opérations</span>
            </div>
            {/* 9. Urgence */}
            <div style={{ marginBottom: '2.5rem' }}>
              <UrgencySelector 
                urgency={formData.urgency} 
                onChange={(val) => setFormData({...formData, urgency: val})} 
              />
            </div>

            {/* Footer / Boutons */}
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                <span style={{ fontWeight: '700', color: '#1E293B' }}>Traçabilité :</span> Toute demande est horodatée et traçable conformément à la procédure ENTP-PROC-042.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/transfers')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#64748B',
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => alert("Le brouillon a été enregistré localement (Simulation)")}
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2C3E50',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Enregistrer comme brouillon
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading || !user?.centreId || !isFormReady}
                  title={
                    !user?.centreId ? 'Votre compte n\'est pas associé à un centre' : 
                    !isFormReady ? 'Veuillez remplir tous les champs obligatoires' : ''
                  }
                  style={{
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#fff',
                    backgroundColor: (submitting || loading || !user?.centreId || !isFormReady) ? '#CBD5E1' : '#E05A1E',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (submitting || loading || !user?.centreId || !isFormReady) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {submitting ? 'Envoi...' : 'Soumettre la demande'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Colonne Droite : Récapitulatif (35%) */}
        <div style={{ flex: '1 1 300px', position: 'sticky', top: '2rem' }}>
          <TransferRecapCard 
            material={selectedMaterial}
            sourceCentre={user?.centre}
            destinationCentre={selectedDestination}
            quantity={formData.quantity}
            urgency={formData.urgency}
            date={todayDate}
            numero={successData?.numero || tempNumero}
            isSubmitted={!!successData}
            isFormReady={isFormReady}
            onPrint={handlePrint}
            motif={formData.motif}
          />
        </div>

      </div>
      
      {/* Composant caché pour l'impression */}
      <BonTransfertPrint transfer={printData} />
    </div>
  );
};

export default NewTransfer;
