import jwt from 'jsonwebtoken';

/**
 * Middleware pour authentifier le token JWT
 */
export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : aucun token fourni'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Doit contenir id, email, role, service
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : token invalide ou expiré'
    });
  }
};

/**
 * Middleware pour limiter l'accès à certains rôles
 * @param {...string} roles - Liste des rôles autorisés (ex: 'Admin', 'Responsable Service')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès interdit : votre rôle (${req.user?.role || 'aucun'}) ne vous permet pas d'effectuer cette action`
      });
    }
    next();
  };
};
