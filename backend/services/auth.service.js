import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';

/**
 * Générer un token JWT pour l'utilisateur
 * @param {object} user - Objet utilisateur de la BDD
 */
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      service: user.service 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

/**
 * Authentifier un utilisateur par email et mot de passe
 * @param {string} email 
 * @param {string} password 
 */
export const authenticateUser = async (email, password) => {
  // 1. Rechercher l'utilisateur dans la base de données
  // const user = await User.findOne({ where: { email } });
  // if (!user) throw new Error('Identifiants invalides');
  
  // 2. Comparer le mot de passe haché
  // const isMatch = await user.comparePassword(password);
  // if (!isMatch) throw new Error('Identifiants invalides');

  // return user;
  return null; 
};
