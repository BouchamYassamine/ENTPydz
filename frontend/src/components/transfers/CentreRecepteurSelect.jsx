import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, ChevronDown, Check, X } from 'lucide-react';

const CentreRecepteurSelect = ({ centres, selectedId, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  const selectedCentre = centres.find(c => c.id === parseInt(selectedId));

  // Fermer le dropdown quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCentres = centres.filter(c => 
    c.nom.toLowerCase().includes(search.toLowerCase()) || 
    c.ville.toLowerCase().includes(search.toLowerCase()) ||
    c.direction?.nom.toLowerCase().includes(search.toLowerCase())
  );

  // Grouper par direction
  const groupedCentres = filteredCentres.reduce((acc, centre) => {
    const dirName = centre.direction?.nom || 'Autre';
    if (!acc[dirName]) acc[dirName] = [];
    acc[dirName].push(centre);
    return acc;
  }, {});

  return (
    <div className="custom-select-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
        Centre de destination <span style={{ color: '#EF4444' }}>*</span>
      </label>

      {!selectedCentre ? (
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.75rem 1rem', 
              backgroundColor: '#fff', 
              border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`, 
              borderRadius: '8px', 
              cursor: 'text',
              transition: 'all 0.2s ease',
              boxShadow: isOpen ? '0 0 0 3px rgba(224, 90, 30, 0.1)' : 'none',
              borderColor: isOpen ? '#E05A1E' : (error ? '#EF4444' : '#E5E7EB')
            }}
          >
            <Search size={16} color="#6B7280" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Rechercher un centre ENTP..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', backgroundColor: 'transparent' }}
            />
            <ChevronDown size={16} color="#6B7280" />
          </div>

          {isOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '300px', overflowY: 'auto' }}>
              {Object.keys(groupedCentres).length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                  Aucun centre trouvé pour "{search}"
                </div>
              ) : (
                Object.keys(groupedCentres).map(direction => (
                  <div key={direction}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {direction}
                      </span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
                    </div>
                    {groupedCentres[direction].map(centre => (
                      <div 
                        key={centre.id}
                        onClick={() => {
                          onChange(centre.id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FDF2ED'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building2 size={14} color="#E05A1E" />
                          <span style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.9rem' }}>{centre.nom}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.2rem', paddingLeft: '1.4rem' }}>
                          {centre.ville} · {centre.wilaya}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '1rem', backgroundColor: '#FDF2ED', border: '1px solid #E05A1E', borderRadius: '8px', position: 'relative' }}>
          <button 
            type="button"
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px', color: '#6B7280' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
          >
            <X size={16} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(224, 90, 30, 0.2)' }}>
              <Check size={18} color="#E05A1E" />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{selectedCentre.nom}</div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: '600' }}>Direction :</span> {selectedCentre.direction?.nom}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} /> {selectedCentre.ville}, {selectedCentre.wilaya}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: '500' }}>{error}</div>}
    </div>
  );
};

export default CentreRecepteurSelect;
