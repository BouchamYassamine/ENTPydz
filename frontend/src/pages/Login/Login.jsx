import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, User } from 'lucide-react';
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
    } else {
      setEmail('responsable.forage@entp.dz');
      setPassword('resp123');
    }
  };

  return (
    <div className="login-page">
      {/* ---- CÔTÉ GAUCHE : Image de fond avec superposition ---- */}
      <div className="login-bg-section">
        <div className="login-bg-logo">
          <div className="login-bg-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="login-bg-logo-text">
            <h1>ENTP</h1>
            <span>Entreprise Nationale des Travaux aux Puits</span>
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
              Système de transfert de matériel<br />entre services
            </p>
          </div>

          {/* Barre orange */}
          <div className="login-divider-bar" />

          {/* Titre Connexion */}
          <div className="login-section-title">
            <User size={22} className="icon" />
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
<<<<<<< HEAD
          <form onSubmit={handleSubmit} autoComplete="off">
=======
          <form onSubmit={handleSubmit}>
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Adresse Email Professionnelle</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={18} /></span>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="exemple@entp.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
<<<<<<< HEAD
                  autoComplete="off"
=======
                  autoComplete="email"
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
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
<<<<<<< HEAD
                  autoComplete="new-password"
=======
                  autoComplete="current-password"
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
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
          <div className="quick-login-grid">
            <button
              type="button"
              className="btn-quick-login admin"
              onClick={() => handleQuickLogin('admin')}
              id="btn-quick-admin"
            >
              <div className="quick-icon">
                <Shield size={18} />
              </div>
              <div className="quick-text">
                <strong>Connexion Admin</strong>
                <span>Accès administrateur</span>
              </div>
            </button>

            <button
              type="button"
              className="btn-quick-login resp"
              onClick={() => handleQuickLogin('resp')}
              id="btn-quick-resp"
            >
              <div className="quick-icon">
                <User size={18} />
              </div>
              <div className="quick-text">
                <strong>Connexion Responsable</strong>
                <span>Accès responsable</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            © 2026 <strong>ENTP</strong> — Entreprise Nationale des Travaux aux Puits<br />
            Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
