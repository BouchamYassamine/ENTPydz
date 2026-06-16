import React, { useState, useEffect } from 'react';
import { UserApi } from '../../services/api.js';
import { Trash2, Edit, Plus, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '', role: 'UTILISATEUR', centreId: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUsers();
    fetchCentres();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UserApi.getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      showMessage("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCentres = async () => {
    // Liste des services ENTP
    setCentres([
      { id: 'Direction Générale', nom: 'Direction Générale' },
      { id: 'Maintenance et Forage', nom: 'Maintenance et Forage' },
      { id: 'Logistique et Transport', nom: 'Logistique et Transport' },
      { id: 'Bureau d\'Études', nom: 'Bureau d\'Études' },
      { id: 'Production', nom: 'Production' },
      { id: 'Sécurité', nom: 'Sécurité' }
    ]);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      
      let prenom = '';
      let nom = '';
      if (user.name) {
        const parts = user.name.split(' ');
        prenom = parts[0] || '';
        nom = parts.slice(1).join(' ') || '';
      }
      
      setFormData({
        nom: nom,
        prenom: prenom,
        email: user.email,
        password: '',
        role: user.role,
        centreId: user.service || ''
      });
    } else {
      setEditingId(null);
      setFormData({ nom: '', prenom: '', email: '', password: '', role: 'UTILISATEUR', centreId: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingId && formData.password.length < 6) {
      showMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }
    
    if (editingId && formData.password && formData.password.length < 6) {
      showMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }

    const dataToSubmit = {
      ...formData,
      service: formData.centreId, // Map centreId to service for backend
      nom: formData.nom,
      prenom: formData.prenom
    };

    try {
      if (editingId) {
        if (!dataToSubmit.password) delete dataToSubmit.password;
        const res = await UserApi.updateUser(editingId, dataToSubmit);
        if (res.success) {
          showMessage("Utilisateur modifié avec succès", "success");
          setShowModal(false);
          fetchUsers();
        }
      } else {
        const res = await UserApi.createUser(dataToSubmit);
        if (res.success) {
          showMessage("Utilisateur créé avec succès", "success");
          setShowModal(false);
          fetchUsers();
        }
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Erreur lors de l'opération", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await UserApi.deleteUser(id);
        showMessage("Utilisateur supprimé", "success");
        fetchUsers();
      } catch (error) {
        showMessage("Erreur lors de la suppression", "error");
      }
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.3rem' }}>Gestion des Utilisateurs</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Administrez les accès et rôles du personnel ENTP.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'var(--primary-color, #FF6B35)', color: 'white', border: 'none', 
            padding: '0.7rem 1.2rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 6px rgba(255, 107, 53, 0.2)'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#e55a2b'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--primary-color, #FF6B35)'}
        >
          <Plus size={18} /> Nouvel Utilisateur
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
          backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
          color: message.type === 'error' ? '#ef4444' : '#16a34a',
          border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
          <div className="btn-spinner" style={{ margin: '0 auto 1rem auto', borderColor: 'var(--primary-color)', borderRightColor: 'transparent' }} />
          Chargement des utilisateurs...
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--white, #fff)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Nom / Prénom</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rôle</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Centre / Service</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--gray-600)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: '500', color: '#1e293b' }}>{u.name}</td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px',
                        backgroundColor: (u.role === 'ADMIN' || u.role === 'Admin') ? 'rgba(255, 107, 53, 0.1)' : '#f1f5f9',
                        color: (u.role === 'ADMIN' || u.role === 'Admin') ? '#FF6B35' : '#64748b'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', color: '#475569' }}>{u.service || '-'}</td>
                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                        <button 
                          onClick={() => handleOpenModal(u)}
                          style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', transition: 'all 0.2s' }}
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', transition: 'all 0.2s' }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                Aucun utilisateur trouvé.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '550px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                {editingId ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Prénom <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} 
                         style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Nom <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} 
                         style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Email professionnel <span style={{color: '#ef4444'}}>*</span></label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                       placeholder="utilisateur@entp.dz"
                       style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  Mot de passe {editingId && <span style={{fontWeight: 'normal', color: '#94a3b8'}}>(Optionnel - laisser vide pour conserver)</span>}
                  {!editingId && <span style={{color: '#ef4444'}}>*</span>}
                </label>
                <input type="password" minLength={6} required={!editingId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                       placeholder={editingId ? "••••••••" : "Min. 6 caractères"}
                       style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Rôle <span style={{color: '#ef4444'}}>*</span></label>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} 
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#fff' }}>
                    <option value="UTILISATEUR">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="Responsable Service">Responsable Service</option>
                    <option value="Agent Logistique">Agent Logistique</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Centre / Service <span style={{color: '#ef4444'}}>*</span></label>
                  <select required value={formData.centreId} onChange={e => setFormData({...formData, centreId: e.target.value})} 
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#fff' }}>
                    <option value="">Sélectionner</option>
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} 
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" 
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color, #FF6B35)', color: '#fff', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(255, 107, 53, 0.2)' }}>
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
