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
};
