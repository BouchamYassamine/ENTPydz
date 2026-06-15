<<<<<<< HEAD
import prisma from '../db.js';

export const getTransfers = async (req, res, next) => {
  try {
    const { role, id: userId } = req.user;
    // Règle 3 : Admin voit TOUS les transferts
    // Règle 2 : Utilisateur ne voit que SES propres transferts
    const whereClause = role === 'Admin' 
      ? {} 
      : { requesterId: userId };
    const transfers = await prisma.transfer.findMany({
      where: whereClause,
      include: {
        material: true,
        requester: { select: { id: true, name: true, email: true, service: true } },
        approver: { select: { id: true, name: true, email: true, service: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: transfers });
  } catch (error) { next(error); }
};

export const createTransfer = async (req, res, next) => {
  try {
    // Règle 1 : Admin ne peut pas créer de transfert
    if (req.user.role === 'Admin') {
      return res.status(403).json({ success: false, message: 'Les administrateurs ne peuvent pas créer de transferts' });
    }

    const { materialId, destinationService, comments } = req.body;
    const { service: sourceService, id: requesterId } = req.user;

    const material = await prisma.material.findUnique({ where: { id: parseInt(materialId) } });
    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });
    if (material.currentService !== sourceService) return res.status(403).json({ success: false, message: 'Ce matériel n\'appartient pas à votre centre' });
    if (material.status !== 'Disponible') return res.status(400).json({ success: false, message: 'Le matériel n\'est pas disponible pour un transfert' });

    const transfer = await prisma.transfer.create({
      data: {
        sourceService, destinationService, materialId: parseInt(materialId), requesterId, comments, status: 'En attente'
      }
    });
    await prisma.material.update({ where: { id: parseInt(materialId) }, data: { status: 'En Transfert' } });
    return res.status(201).json({ success: true, message: 'Transfert créé avec succès', data: transfer });
  } catch (error) { next(error); }
};

export const updateTransferStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { service, role, id: userId } = req.user;

    const transfer = await prisma.transfer.findUnique({ where: { id: parseInt(id) }, include: { material: true } });
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfert introuvable' });

    if (status === 'Complété') {
      if (role !== 'Admin' && transfer.destinationService !== service) return res.status(403).json({ success: false, message: 'Vous ne pouvez réceptionner que les transferts destinés à votre centre' });
      const updatedTransfer = await prisma.transfer.update({
        where: { id: parseInt(id) },
        data: { status: 'Complété', approverId: userId, processedAt: new Date() }
      });
      await prisma.material.update({
        where: { id: transfer.materialId },
        data: { currentService: transfer.destinationService, status: 'Disponible' }
      });
      return res.status(200).json({ success: true, message: 'Transfert complété avec succès', data: updatedTransfer });
    } else if (status === 'Refusé') {
      if (role !== 'Admin' && transfer.destinationService !== service) return res.status(403).json({ success: false, message: 'Non autorisé' });
      const updatedTransfer = await prisma.transfer.update({
        where: { id: parseInt(id) },
        data: { status: 'Refusé', approverId: userId, processedAt: new Date() }
      });
      await prisma.material.update({ where: { id: transfer.materialId }, data: { status: 'Disponible' } });
      return res.status(200).json({ success: true, message: 'Transfert refusé avec succès', data: updatedTransfer });
    } else {
       const updatedTransfer = await prisma.transfer.update({ where: { id: parseInt(id) }, data: { status, approverId: userId } });
       return res.status(200).json({ success: true, message: `Transfert mis à jour (${status})`, data: updatedTransfer });
    }
  } catch (error) { next(error); }
=======
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
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
};
