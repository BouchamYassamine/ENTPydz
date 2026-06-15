import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
<<<<<<< HEAD
import MaterialSelector from '../../components/MaterialSelector.jsx';
=======
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
import { ArrowLeft, Send } from 'lucide-react';

const NewTransfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    materialBarcode: '',
<<<<<<< HEAD
    selectedMaterials: [],
=======
    materialName: '',
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    destinationService: '',
    reason: ''
  });

  const services = ['Forage', 'Maintenance', 'Transport', 'Logistique', 'Production', 'Sécurité'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Votre demande de transfert a été soumise au responsable de service avec succès.');
    navigate('/transfers');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Bouton Retour */}
      <button 
        onClick={() => navigate('/transfers')}
        style={{
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--gray-600)',
          fontSize: '0.9rem',
          fontWeight: '500',
          marginBottom: '1.5rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </button>

      <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
        Créer une demande de transfert
      </h1>
      <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Formulaire officiel de transfert de matériel sous la supervision du service logistique ENTP.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        {/* Service Émetteur (Rempli automatiquement) */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)', display: 'block', marginBottom: '0.4rem' }}>
            Service Émetteur
          </label>
          <input 
            type="text" 
            value={user?.service || 'Votre Service'} 
            disabled 
            style={{
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              fontSize: '0.95rem',
              backgroundColor: 'var(--light-color)',
              width: '100%',
              cursor: 'not-allowed',
              fontWeight: '600'
            }}
          />
        </div>

        {/* Code barre du matériel */}
        <Input 
          label="Code barre ou Code inventaire du matériel"
          name="materialBarcode"
          placeholder="Ex: ENTP-EQP-XXXXXX"
          value={formData.materialBarcode}
          onChange={handleChange}
          required
        />

<<<<<<< HEAD
        {/* Désignation du matériel (Multi-select) */}
        <MaterialSelector 
          selectedMaterials={formData.selectedMaterials}
          onChange={(newSelection) => setFormData({ ...formData, selectedMaterials: newSelection })}
=======
        {/* Désignation du matériel */}
        <Input 
          label="Désignation précise du matériel"
          name="materialName"
          placeholder="Ex: Tiges de forage, Compresseur de chantier, Pompe..."
          value={formData.materialName}
          onChange={handleChange}
          required
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
        />

        {/* Service Récepteur */}
        <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column' }}>
          <label 
            htmlFor="destinationService"
            style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: '0.4rem' }}
          >
            Service Récepteur Destinataire <span style={{ color: 'var(--danger-color)' }}>*</span>
          </label>
          <select
            id="destinationService"
            name="destinationService"
            value={formData.destinationService}
            onChange={handleChange}
            required
            style={{
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              fontSize: '0.95rem',
              backgroundColor: 'var(--white)',
              width: '100%'
            }}
          >
            <option value="">Sélectionner le service destinataire</option>
            {services
              .filter(s => s !== user?.service) // Exclure le service actuel
              .map((srv, idx) => (
                <option key={idx} value={srv}>{srv}</option>
              ))
            }
          </select>
        </div>

        {/* Motif du Transfert */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <label 
            htmlFor="reason"
            style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: '0.4rem' }}
          >
            Motif de la demande de transfert <span style={{ color: 'var(--danger-color)' }}>*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            placeholder="Veuillez décrire le motif du transfert, l'emplacement cible et le besoin..."
            value={formData.reason}
            onChange={handleChange}
            required
            style={{
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-200)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-family)',
              width: '100%',
              resize: 'vertical'
            }}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          <Send size={18} />
          Soumettre la demande
        </Button>

      </form>
    </div>
  );
};

export default NewTransfer;
