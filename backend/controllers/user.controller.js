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
};
