import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, User, Globe, HardHat, Settings, Users } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      setSubmitting(false);
    }
  };

  // Raccourci pour faciliter le test pendant le stage
  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@entp.dz');
      setPassword('admin123');
    } else if (role === 'resp') {
      setEmail('responsable@entp.dz');
      setPassword('resp123');
    } else if (role === 'agent') {
      setEmail('agent@entp.dz');
      setPassword('agent123');
    }
  };

  return (
    <div className="login-page">
      {/* ---- CÔTÉ GAUCHE : Image de fond avec superposition ---- */}
      <div className="login-bg-section">
        {/* Sélecteur de langue */}
        <div className="language-selector">
          <Globe size={16} /> Français <span className="chevron">v</span>
        </div>

        {/* Logo ENTP en haut à gauche */}
        <div className="login-logo-container">
          <div className="logo-illustration">
             <div className="derrick-icon">
                <svg width="40" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L8 22M12 2l4 20M8 8h8M7 14h10M6 20h12" /></svg>
             </div>
             <div className="logo-text-block">
               <h1 className="logo-entp-title">ENTP</h1>
               <p className="logo-arabic">المؤسسة الوطنية<br/>لإنجاز الآبار</p>
               <div className="logo-orange-line"></div>
               <p className="logo-sonatrach">GROUPE SONATRACH</p>
             </div>
          </div>
        </div>

        {/* Textes en bas à gauche */}
        <div className="login-bottom-content">
          <h1 className="main-title">
            ENTREPRISE NATIONALE<br />DES TRAVAUX AUX PUITS
          </h1>
          <h2 className="main-subtitle">GROUPE SONATRACH</h2>

          <div className="features-container">
            <div className="feature-item">
              <HardHat size={26} className="feature-icon" />
              <div className="feature-text">
                <strong>Sécurité</strong>
                <span>Notre priorité</span>
              </div>
            </div>
            <div className="feature-divider" />
            <div className="feature-item">
              <Settings size={26} className="feature-icon" />
              <div className="feature-text">
                <strong>Performance</strong>
                <span>Notre exigence</span>
              </div>
            </div>
            <div className="feature-divider" />
            <div className="feature-item">
              <Users size={26} className="feature-icon" />
              <div className="feature-text">
                <strong>Engagement</strong>
                <span>Notre valeur</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- CÔTÉ DROIT : Carte de connexion ---- */}
      <div className="login-card-section">
        <div className="login-card">
          {/* En-tête */}
          <div className="login-card-header">
            <h2>ENTP</h2>
            <p className="subtitle">
              SYSTÈME DE GESTION ET DE TRANSFERT<br />DE MATÉRIEL ENTRE SERVICES
            </p>
          </div>

          {/* Barre orange */}
          <div className="login-divider-bar" />

          {/* Titre Connexion */}
          <div className="login-section-title">
            <h3>Connexion</h3>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Adresse email professionnelle</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={18} /></span>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="utilisateur@entp.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="login-password">Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Afficher/masquer le mot de passe"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            </div>

            {/* Bouton Se connecter */}
            <button
              type="submit"
              className="btn-login"
              disabled={submitting}
              id="btn-se-connecter"
            >
              {submitting ? (
                <>
                  <div className="btn-spinner" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <span className="arrow-icon">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="login-separator">
            <span>OU</span>
          </div>

          {/* Boutons de connexion rapide */}
          <div className="quick-login-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-quick-login admin"
              onClick={() => handleQuickLogin('admin')}
              style={{ padding: '0.5rem', gap: '0.4rem' }}
            >
              <div className="quick-icon" style={{ width: '28px', height: '28px' }}>
                <Shield size={14} />
              </div>
              <div className="quick-text">
                <strong style={{ fontSize: '0.7rem' }}>Admin</strong>
                <span style={{ fontSize: '0.6rem' }}>Global</span>
              </div>
            </button>

            <button
              type="button"
              className="btn-quick-login resp"
              onClick={() => handleQuickLogin('resp')}
              style={{ padding: '0.5rem', gap: '0.4rem' }}
            >
              <div className="quick-icon" style={{ width: '28px', height: '28px' }}>
                <Shield size={14} />
              </div>
              <div className="quick-text">
                <strong style={{ fontSize: '0.7rem' }}>Admin Centre</strong>
                <span style={{ fontSize: '0.6rem' }}>Forage</span>
              </div>
            </button>

            <button
              type="button"
              className="btn-quick-login resp"
              onClick={() => handleQuickLogin('agent')}
              style={{ padding: '0.5rem', gap: '0.4rem' }}
            >
              <div className="quick-icon" style={{ width: '28px', height: '28px' }}>
                <User size={14} />
              </div>
              <div className="quick-text">
                <strong style={{ fontSize: '0.7rem' }}>Utilisateur</strong>
                <span style={{ fontSize: '0.6rem' }}>Forage</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            © 2024 <strong>ENTP</strong> - Entreprise Nationale des Travaux aux Puits<br />
            Groupe Sonatrach - Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
