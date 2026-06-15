import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import prisma from '../db.js';
import bcrypt from 'bcryptjs';

=======
import User from '../models/user.model.js';

/**
 * @desc    Connexion de l'utilisateur et génération du token JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
<<<<<<< HEAD
=======
    // 1. Validation des champs requis
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un email et un mot de passe' });
    }

<<<<<<< HEAD
    const user = await prisma.user.findUnique({ where: { email } });
=======
    // 2. Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({ where: { email } });
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

<<<<<<< HEAD
=======
    // 3. Vérification que le compte est actif
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Ce compte a été désactivé. Contactez l\'administrateur.' });
    }

<<<<<<< HEAD
    const isMatch = await bcrypt.compare(password, user.password);
=======
    // 4. Vérification du mot de passe avec bcrypt
    const isMatch = await user.comparePassword(password);
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

<<<<<<< HEAD
=======
    // 5. Génération du token JWT signé
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      service: user.service
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: payload
    });
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
export const logout = async (req, res, next) => {
  try {
=======
/**
 * @desc    Déconnexion de l'utilisateur
 * @route   POST /api/auth/logout
 * @access  Private (Protégé par JWT)
 */
export const logout = async (req, res, next) => {
  try {
    // Logique pour invalider le token si nécessaire (ex: blacklist dans Redis)
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
export const getMe = async (req, res, next) => {
  try {
=======
/**
 * @desc    Récupérer les informations de l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private (Protégé par JWT)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user est injecté par le middleware de protection JWT (decoded token payload)
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
