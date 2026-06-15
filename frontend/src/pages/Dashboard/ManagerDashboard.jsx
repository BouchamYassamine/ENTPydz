import React from 'react';
import useAuth from '../../hooks/useAuth.js';
import { ArrowUpRight, ArrowDownLeft, Clock, Inbox } from 'lucide-react';
import './Dashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();

  // Statistiques fictives spécifiques au service de l'utilisateur
  const stats = [
    { title: 'Demandes Envoyées', value: 12, icon: <ArrowUpRight size={24} />, color: 'var(--primary-color)' },
    { title: 'Demandes Reçues', value: 8, icon: <ArrowDownLeft size={24} />, color: 'var(--secondary-color)' },
    { title: 'En Attente de Validation', value: 3, icon: <Clock size={24} />, color: 'var(--warning-color)' }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header-title">
        <h1>Tableau de Bord Service - {user?.service || 'Général'}</h1>
        <p>Bienvenue, {user?.name}. Suivi des flux de matériel entrants et sortants de votre département.</p>
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

      {/* Action rapide ou tâches en attente */}
      <div className="dashboard-content-grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Inbox size={20} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Demandes de transferts à approuver</h2>
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Vous n'avez aucune demande en attente de signature pour le service <strong>{user?.service}</strong> aujourd'hui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
