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
      {/* En-tête de page */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/transfers')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '600', padding: 0 }}>
          <ArrowLeft size={16} /> Accueil &gt; Transferts &gt; Nouveau
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FDF2ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={24} color="#E05A1E" />
          </div>
          <h1 style={{ color: '#1A1A2E', fontSize: '2rem', fontWeight: '800', margin: 0 }}>Initier un Transfert</h1>
        </div>
        <p style={{ color: '#6B7280', fontSize: '1rem', margin: '0 0 1.5rem 64px' }}>Demandez le transfert d'un matériel vers un autre centre ENTP.</p>
        <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%' }}></div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }} id="form-top">
        
        {/* Colonne Gauche : Formulaire (65%) */}
        <div style={{ flex: '1 1 600px', backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1A1A2E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#E05A1E" /> Détails du transfert
          </h2>

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
            {/* 1. N° et 2. Date */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#6B7280' }}>
                  N° Bon de transfert
                </label>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontWeight: '600', fontSize: '0.9rem' }}>
                  <Hash size={16} /> {tempNumero} <span style={{ fontSize: '0.7rem', fontWeight: '400', fontStyle: 'italic' }}>(auto)</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#6B7280' }}>
                  Date de demande
                </label>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontWeight: '600', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> {todayDate}
                </div>
              </div>
            </div>

            {/* 3. Centre émetteur */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#6B7280' }}>
                Centre émetteur (auto)
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
            <div id="field-destinationCentreId" style={{ marginBottom: '2rem' }}>
              <CentreRecepteurSelect 
                centres={centres} 
                selectedId={formData.destinationCentreId} 
                onChange={(id) => setFormData({...formData, destinationCentreId: id})}
                error={errors.destinationCentreId}
              />
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
            <div id="field-quantity" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
                Quantité à transférer <span style={{ color: '#EF4444' }}>*</span>
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

            {/* 7. Motif */}
            <div id="field-motif" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
                Motif du transfert <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>Expliquez brièvement la raison du transfert</div>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
                Observations (optionnel)
              </label>
              <textarea 
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                placeholder="Informations complémentaires, état du matériel, recommandations de transport..."
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* 9. Urgence */}
            <div style={{ marginBottom: '2.5rem' }}>
              <UrgencySelector 
                urgency={formData.urgency} 
                onChange={(val) => setFormData({...formData, urgency: val})} 
              />
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 0 1.25rem 0' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🔒 Soumis à validation responsable centre
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/transfers')}
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#4B5563',
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = '#fff'; }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading || !user?.centreId}
                  title={!user?.centreId ? 'Votre compte n\'est pas associé à un centre' : ''}
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#fff',
                    backgroundColor: '#E05A1E',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (submitting || loading || !user?.centreId) ? 'not-allowed' : 'pointer',
                    opacity: (submitting || loading || !user?.centreId) ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#C94D18'; }}
                  onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = '#E05A1E'; }}
                >
                  {submitting ? (
                    <>
                      <span style={{
                        display: 'inline-block', width: '14px', height: '14px',
                        border: '2px solid #fff', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.6s linear infinite'
                      }} />
                      Envoi...
                    </>
                  ) : '→ Soumettre la demande'}
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
          />
        </div>

      </div>
      
      {/* Composant caché pour l'impression */}
      <BonTransfertPrint transfer={printData} />
    </div>
  );
};

export default NewTransfer;
