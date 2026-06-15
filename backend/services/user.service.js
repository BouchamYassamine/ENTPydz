// Logique d'accès aux données utilisateur et logique métier
// import User from '../models/user.model.js';

export const getAllUsers = async () => {
  // return await User.findAll({ attributes: { exclude: ['password'] } });
  return [];
};

export const createUser = async (userData) => {
  // return await User.create(userData);
  return null;
};
