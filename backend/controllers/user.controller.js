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

export const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, name: true, email: true, role: true, service: true, isActive: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    return res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role, centreId } = req.body;
    
    // Build full name — handle all combinations
    let fullName = '';
    if (prenom || nom) {
      fullName = `${(prenom || '')} ${(nom || '')}`.trim();
    } else if (req.body.name) {
      fullName = req.body.name.trim();
    }
    
    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Le nom et le prénom sont requis' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'L\'email est requis' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    // Support either centreId or service
    const serviceName = centreId || req.body.service || '';
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: { name: fullName, email, password: hashedPassword, role, service: serviceName, isActive: true }
    });
    
    return res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: { id: user.id, name: user.name, email: user.email, role: user.role, service: user.service } });
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const { nom, prenom, email, role, centreId, password } = req.body;
    
    const updateData = {};
    if (nom || prenom) updateData.name = `${prenom || ''} ${nom || ''}`.trim() || req.body.name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (centreId || req.body.service) updateData.service = centreId || req.body.service;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    return res.status(200).json({ success: true, message: 'Utilisateur modifié avec succès', data: { id: user.id, name: user.name, email: user.email, role: user.role, service: user.service } });
  } catch (error) { 
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });
    next(error); 
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    return res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) { next(error); }
};
