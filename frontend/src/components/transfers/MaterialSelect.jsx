import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, Check, X, Tag } from 'lucide-react';

const getStatusColor = (status) => {
  if (status === 'Disponible') return '#10B981';
  if (status === 'En Transfert' || status === 'En transfert') return '#F59E0B';
  return '#EF4444'; // Hors service / Autre
};

const MaterialSelect = ({ materials, selectedId, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  const selectedMaterial = materials.find(m => m.id === parseInt(selectedId));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.barcode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="custom-select-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#1A1A2E' }}>
        Matériel à transférer <span style={{ color: '#EF4444' }}>*</span>
      </label>

      {!selectedMaterial ? (
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
              boxShadow: isOpen ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none',
              borderColor: isOpen ? '#10B981' : (error ? '#EF4444' : '#E5E7EB')
            }}
          >
            <Search size={16} color="#6B7280" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Rechercher un matériel par nom ou code..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', backgroundColor: 'transparent' }}
            />
          </div>

          {isOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '300px', overflowY: 'auto' }}>
              {filteredMaterials.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                  Aucun matériel trouvé
                </div>
              ) : (
                filteredMaterials.map(mat => {
                  const isDisponible = mat.status === 'Disponible';
                  const statusColor = getStatusColor(mat.status);
                  
                  return (
                    <div 
                      key={mat.id}
                      onClick={() => {
                        if (isDisponible) {
                          onChange(mat.id);
                          setIsOpen(false);
                          setSearch('');
                        }
                      }}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        cursor: isDisponible ? 'pointer' : 'not-allowed', 
                        borderBottom: '1px solid #F3F4F6', 
                        transition: 'background-color 0.2s',
                        opacity: isDisponible ? 1 : 0.6,
                        backgroundColor: 'transparent'
                      }}
                      onMouseOver={(e) => { if(isDisponible) e.currentTarget.style.backgroundColor = '#F0FDF4'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Package size={14} color={isDisponible ? '#10B981' : '#9CA3AF'} />
                          <span style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '0.9rem' }}>{mat.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '500', color: statusColor }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }}></div>
                          {mat.status}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.2rem', paddingLeft: '1.4rem', fontFamily: 'monospace' }}>
                        {mat.barcode}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', border: '1px solid #10B981', borderRadius: '8px', position: 'relative' }}>
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
            <div style={{ backgroundColor: '#fff', padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Check size={18} color="#10B981" />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#1A1A2E', fontSize: '0.95rem' }}>{selectedMaterial.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: '600' }}>Barcode :</span> <code style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px' }}>{selectedMaterial.barcode}</code>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                {selectedMaterial.status}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: '500' }}>{error}</div>}
    </div>
  );
};

export default MaterialSelect;
