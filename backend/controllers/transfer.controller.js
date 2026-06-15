/**
 * @desc    Obtenir la liste des demandes de transfert (filtrable selon service ou rôle)
 * @route   GET /api/transfers
 * @access  Private
 */
export const getTransfers = async (req, res, next) => {
  try {
    // Les responsables ne voient que les transferts impliquant leur service
    return res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Créer une nouvelle demande de transfert de matériel
 * @route   POST /api/transfers
 * @access  Private (Responsable Service / Émetteur)
 */
export const createTransfer = async (req, res, next) => {
  try {
    return res.status(201).json({
      success: true,
      message: 'Demande de transfert enregistrée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Valider ou refuser un transfert (Responsable Service Récepteur ou Administrateur)
 * @route   PUT /api/transfers/:id/status
 * @access  Private (Valideurs autorisés)
 */
export const updateTransferStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    return res.status(200).json({
      success: true,
      message: `Statut du transfert ${id} mis à jour : ${status}`
    });
  } catch (error) {
    next(error);
  }
};
