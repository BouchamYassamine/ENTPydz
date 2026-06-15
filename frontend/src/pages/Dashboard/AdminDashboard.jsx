import React from 'react';
import useAuth from '../../hooks/useAuth.js';
import { ArrowLeftRight, Users, CheckSquare, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Statistiques fictives pour la console d'administration
  const stats = [
    { title: 'Utilisateurs Actifs', value: 24, icon: <Users size={24} />, color: '#3b82f6' },
    { title: 'Total Transferts', value: 148, icon: <ArrowLeftRight size={24} />, color: 'var(--primary-color)' },
    { title: 'Transferts en Attente', value: 7, icon: <AlertCircle size={24} />, color: 'var(--warning-color)' },
    { title: 'Complétés ce Mois', value: 32, icon: <CheckSquare size={24} />, color: 'var(--success-color)' }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header-title">
        <h1>Console d'Administration ENTP</h1>
        <p>Bienvenue, {user?.name}. Gestion globale des utilisateurs et surveillance des flux de transfert de matériel.</p>
      </div>

      {/* Grid de Cartes de Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections Administrateur supplémentaires */}
      <div className="dashboard-content-grid">
        <div className="card">
          <h2>Activités Récentes du Système</h2>
          <div className="activity-list" style={{ marginTop: '1rem' }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              • L'utilisateur <strong>Amine K. (Responsable Forage)</strong> a initié une demande de transfert pour une Pompe Hydraulique vers le service <em>Maintenance</em>. (Il y a 10 mins)
            </p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              • La demande de transfert #742 a été validée par <strong>Sofiane T. (Responsable Logistique)</strong>. (Il y a 1h)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
