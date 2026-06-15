/**
 * Middleware centralisé pour attraper et formater toutes les erreurs du serveur
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err);

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Une erreur interne du serveur est survenue.',
    // N'inclut la stack trace qu'en mode développement pour des raisons de sécurité
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
