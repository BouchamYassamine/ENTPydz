import React, { useState, useEffect } from 'react';
import { UserApi } from '../../services/api.js';
import { Trash2, Edit, Plus, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [centres, setCentres] = useState([]); // Mock ou API call pour les centres
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
    // Si une API pour les centres existe, on l'appelle ici.
    // Pour l'instant on utilise un mock en fonction des données ENTP.
    setCentres([
      { id: 1, nom: 'Ouargla' },
      { id: 2, nom: 'Hassi Messaoud' },
      { id: 3, nom: 'Alger' }
    ]);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        nom: user.nom.split(' ')[1] || '',
        prenom: user.nom.split(' ')[0] || '',
        email: user.email,
        password: '',
        role: user.role,
        centreId: user.centreId || ''
      });
    } else {
      setEditingId(null);
      setFormData({ nom: '', prenom: '', email: '', password: '', role: 'UTILISATEUR', centreId: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length > 0 && formData.password.length < 6) {
      showMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }

    const dataToSubmit = {
      ...formData,
      nom: `${formData.prenom} ${formData.nom}`.trim()
    };

    try {
      if (editingId) {
        if (!dataToSubmit.password) delete dataToSubmit.password;
        await UserApi.updateUser(editingId, dataToSubmit);
        showMessage("Utilisateur modifié avec succès", "success");
      } else {
        if (!dataToSubmit.password) {
          showMessage("Mot de passe requis pour un nouvel utilisateur", "error");
          return;
        }
        await UserApi.createUser(dataToSubmit);
        showMessage("Utilisateur créé avec succès", "success");
      }
      setShowModal(false);
      fetchUsers();
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color, #1e293b)' }}>Gestion des utilisateurs</h1>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#FF6B35', color: 'white', border: 'none', 
            padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Nouvel utilisateur
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px',
          backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3',
          color: message.type === 'error' ? '#b91c1c' : '#15803d'
        }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <div className="card" style={{ overflowX: 'auto', backgroundColor: 'var(--white, #fff)', borderRadius: '8px', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '1rem' }}>Nom</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Rôle</th>
                <th style={{ padding: '1rem' }}>Centre</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>{u.nom}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: u.role === 'ADMIN' ? 'rgba(255, 107, 53, 0.1)' : '#f1f5f9',
                      color: u.role === 'ADMIN' ? '#FF6B35' : '#64748b'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{u.centre?.nom || `Centre ${u.centreId}`}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleOpenModal(u)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--dark-color, #1e293b)', color: '#fff', 
            borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '500px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>
              {editingId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Prénom</label>
                  <input type="text" required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} 
                         style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Nom</label>
                  <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} 
                         style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                       style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Mot de passe {editingId && '(Laisser vide pour ne pas modifier)'}</label>
                <input type="password" minLength={6} required={!editingId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                       style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Rôle</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} 
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                    <option value="UTILISATEUR">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Centre</label>
                  <select required value={formData.centreId} onChange={e => setFormData({...formData, centreId: e.target.value})} 
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #475569', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                    <option value="">Sélectionner</option>
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} 
                        style={{ padding: '0.6rem 1.2rem', borderRadius: '4px', border: '1px solid #475569', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" 
                        style={{ padding: '0.6rem 1.2rem', borderRadius: '4px', border: 'none', backgroundColor: '#FF6B35', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingId ? 'Mettre à jour' : 'Créer'}
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
