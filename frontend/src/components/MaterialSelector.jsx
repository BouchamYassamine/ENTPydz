import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronDown, Check, ArrowLeft } from 'lucide-react';

const categoriesData = [
  { id: 1, nom: "Forage", materiels: ["Tiges de forage", "Trépan", "Outils de coupe", "Moteur de fond"] },
  { id: 2, nom: "Compression", materiels: ["Compresseur de chantier", "Bouteille d'air", "Détendeur"] },
  { id: 3, nom: "Pompage", materiels: ["Pompe immergée", "Pompe centrifuge", "Pompe à boue"] },
  { id: 4, nom: "Informatique", materiels: ["Ordinateur portable", "Imprimante", "Serveur", "Switch"] },
  { id: 5, nom: "Véhicules", materiels: ["Camion de transport", "Véhicule utilitaire", "Chariot élévateur"] }
];

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const MaterialSelector = ({ selectedMaterials, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local state for the panel selections before validating
  const [localSelection, setLocalSelection] = useState([...selectedMaterials]);
  
  const containerRef = useRef(null);

  useEffect(() => {
    // Sync local selection when opened
    if (isOpen) {
      setLocalSelection([...selectedMaterials]);
    }
  }, [isOpen, selectedMaterials]);

  useEffect(() => {
    // Close panel when clicking outside
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMaterial = (materiel) => {
    setLocalSelection(prev => 
      prev.includes(materiel) 
        ? prev.filter(m => m !== materiel)
        : [...prev, materiel]
    );
  };

  const handleValidate = () => {
    onChange(localSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleRemoveChip = (materiel) => {
    const newSelection = selectedMaterials.filter(m => m !== materiel);
    onChange(newSelection);
  };

  // Filtrage
  const normalizedSearch = removeAccents(searchTerm.toLowerCase());
  
  // Tous les matériels si on recherche
  const allMaterials = categoriesData.flatMap(c => c.materiels);
  const filteredMaterials = searchTerm 
    ? allMaterials.filter(m => removeAccents(m.toLowerCase()).includes(normalizedSearch))
    : activeCategory 
      ? categoriesData.find(c => c.id === activeCategory.id)?.materiels || []
      : [];

  return (
    <div className="material-selector-container" ref={containerRef} style={{ marginBottom: '1.2rem', position: 'relative' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-600)', display: 'block', marginBottom: '0.4rem' }}>
        Désignation précise du matériel <span style={{ color: 'var(--danger-color)' }}>*</span>
      </label>

      {/* Selected Chips Area */}
      {selectedMaterials.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {selectedMaterials.map((mat, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              color: '#FF6B35',
              padding: '0.3rem 0.6rem',
              borderRadius: '1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 107, 53, 0.3)'
            }}>
              {mat}
              <button 
                type="button" 
                onClick={() => handleRemoveChip(mat)}
                style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.7rem 0.9rem',
          borderRadius: 'var(--border-radius, 8px)',
          border: '1px solid var(--gray-200, #e2e8f0)',
          fontSize: '0.95rem',
          backgroundColor: 'var(--white, #fff)',
          width: '100%',
          cursor: 'pointer',
          color: selectedMaterials.length > 0 ? 'var(--dark-color, #1e293b)' : 'var(--gray-400, #94a3b8)',
          textAlign: 'left'
        }}
      >
        {selectedMaterials.length > 0 
          ? `${selectedMaterials.length} matériel(s) sélectionné(s)`
          : 'Cliquez pour sélectionner des matériels...'}
        <ChevronDown size={18} style={{ color: 'var(--gray-500, #64748b)' }} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: 'var(--dark-color, #1e293b)',
          borderRadius: 'var(--border-radius, 8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '400px',
          overflow: 'hidden',
          color: '#f8fafc'
        }}>
          {/* Header & Search */}
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Rechercher un matériel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {!searchTerm && !activeCategory && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.3rem' }}>
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Catégories
                </div>
                {categoriesData.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.8rem 1rem',
                      background: 'none',
                      border: 'none',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{cat.nom}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                      {cat.materiels.length}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {(searchTerm || activeCategory) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {!searchTerm && activeCategory && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(null)}
                      style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '600', padding: 0 }}
                    >
                      <ArrowLeft size={14} /> Retour aux catégories
                    </button>
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#94a3b8' }}>
                      {activeCategory.nom}
                    </span>
                  </div>
                )}
                
                {searchTerm && (
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Résultats pour "{searchTerm}"
                  </div>
                )}

                {filteredMaterials.map((mat, idx) => {
                  const isSelected = localSelection.includes(mat);
                  return (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.6rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'background 0.2s',
                        backgroundColor: isSelected ? 'rgba(255, 107, 53, 0.1)' : 'transparent'
                      }}
                      onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)' }}
                      onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '4px',
                        border: `2px solid ${isSelected ? '#FF6B35' : '#64748b'}`,
                        backgroundColor: isSelected ? '#FF6B35' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleMaterial(mat)}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : '#e2e8f0' }}>{mat}</span>
                    </label>
                  );
                })}

                {filteredMaterials.length === 0 && (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Aucun matériel trouvé.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '1rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {localSelection.length} sélectionné(s)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={handleCancel}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent', color: '#e2e8f0', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleValidate}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
                  background: '#FF6B35', color: '#fff', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;
