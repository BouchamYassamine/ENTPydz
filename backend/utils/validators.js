// Utilitaires de validation d'entrées (ex: validation des schémas d'email, mot de passe)
// Vous pouvez importer Joi ou Zod ici

export const validateLoginInput = (data) => {
  const errors = {};
  if (!data.email) errors.email = 'Email requis';
  if (!data.password) errors.password = 'Mot de passe requis';
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
