<<<<<<< HEAD
import prisma from '../db.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, service: true, isActive: true, createdAt: true }
    });
    return res.status(200).json({ success: true, message: 'Liste des utilisateurs récupérée', data: users });
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, service } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, service, isActive: true }
    });
    
    return res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: { id: user.id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
=======
/**
 * @desc    Obtenir la liste de tous les utilisateurs (Réservé Admin)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res, next) => {
  try {
    // Appel du service pour lister les utilisateurs
    return res.status(200).json({
      success: true,
      message: 'Liste des utilisateurs récupérée',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Créer un nouvel utilisateur (Réservé Admin)
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = async (req, res, next) => {
  try {
    return res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    next(error);
  }
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
};
