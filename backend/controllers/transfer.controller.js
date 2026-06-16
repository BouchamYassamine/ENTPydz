import prisma from '../db.js';

export const getTransfers = async (req, res, next) => {
  try {
    const { role, centreId } = req.user;
    
    let whereClause = {};
    if (role === 'Admin Centre') {
      // Admin Centre voit tous les transferts de SON centre (entrants + sortants)
      whereClause = {
        OR: [
          { sourceCentreId: centreId },
          { destinationCentreId: centreId }
        ]
      };
    } else if (role !== 'Admin') {
      // Utilisateur voit uniquement SES propres transferts
      whereClause = { requesterId: req.user.id };
    }

    const transfers = await prisma.transfer.findMany({
      where: whereClause,
      include: {
        material: { select: { id: true, barcode: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        approver: { select: { id: true, name: true, email: true } },
        sourceCentre: { select: { id: true, nom: true } },
        destinationCentre: { select: { id: true, nom: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: transfers });
  } catch (error) { next(error); }
};

export const getTransfertsEnvoyes = async (req, res, next) => {
  try {
    const centreId = parseInt(req.params.centreId);
    if (req.user.role !== 'Admin' && req.user.centreId !== centreId) {
       return res.status(403).json({ success: false, message: 'Non autorisé à voir ces transferts' });
    }
    const transfers = await prisma.transfer.findMany({
      where: { sourceCentreId: centreId },
      include: {
        material: { select: { id: true, barcode: true, name: true } },
        requester: { select: { id: true, name: true } },
        approver: { select: { id: true, name: true } },
        destinationCentre: { select: { id: true, nom: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: transfers });
  } catch (error) { next(error); }
};

export const getTransfertsRecus = async (req, res, next) => {
  try {
    const centreId = parseInt(req.params.centreId);
    if (req.user.role !== 'Admin' && req.user.centreId !== centreId) {
       return res.status(403).json({ success: false, message: 'Non autorisé à voir ces transferts' });
    }
    const transfers = await prisma.transfer.findMany({
      where: { destinationCentreId: centreId },
      include: {
        material: { select: { id: true, barcode: true, name: true } },
        requester: { select: { id: true, name: true } },
        sourceCentre: { select: { id: true, nom: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: transfers });
  } catch (error) { next(error); }
};

export const createTransfer = async (req, res, next) => {
  try {
    // Règle : Seul un Utilisateur peut créer un transfert
    if (req.user.role === 'Admin' || req.user.role === 'Admin Centre') {
      return res.status(403).json({ success: false, message: 'Seuls les utilisateurs peuvent créer des demandes de transfert' });
    }

    const { materialId, destinationCentreId, comments } = req.body;
    const { centreId: sourceCentreId, id: requesterId } = req.user;

    const material = await prisma.material.findUnique({ where: { id: parseInt(materialId) } });
    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });
    if (material.centreId !== sourceCentreId) return res.status(403).json({ success: false, message: 'Ce matériel n\'appartient pas à votre centre' });
    if (material.status !== 'Disponible') return res.status(400).json({ success: false, message: 'Le matériel n\'est pas disponible pour un transfert' });
    if (sourceCentreId === parseInt(destinationCentreId)) return res.status(400).json({ success: false, message: 'La destination doit être différente de la source' });

    const transfer = await prisma.transfer.create({
      data: {
        sourceCentreId,
        destinationCentreId: parseInt(destinationCentreId),
        materialId: parseInt(materialId),
        requesterId,
        comments,
        status: 'En attente'
      }
    });
    await prisma.material.update({ where: { id: parseInt(materialId) }, data: { status: 'En Transfert' } });
    return res.status(201).json({ success: true, message: 'Demande de transfert créée', data: transfer });
  } catch (error) { next(error); }
};

export const validateTransfer = async (req, res, next) => {
  // Utilisé par l'Admin Centre SOURCE pour Approuver ou Refuser
  try {
    const { id } = req.params;
    const { status, motif } = req.body; // 'Approuvé' ou 'Refusé'
    const { role, centreId, id: userId } = req.user;

    const transfer = await prisma.transfer.findUnique({ where: { id: parseInt(id) } });
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfert introuvable' });

    // Seul l'Admin Centre du centre source peut valider, ou l'Admin Global
    const canValidate = role === 'Admin' || (role === 'Admin Centre' && transfer.sourceCentreId === centreId);
    if (!canValidate) {
      return res.status(403).json({ success: false, message: "Seul l'Admin Centre du centre source peut valider cette demande" });
    }
    if (transfer.status !== 'En attente') {
      return res.status(400).json({ success: false, message: 'Ce transfert a déjà été traité' });
    }

    if (status === 'Approuvé') {
      const updated = await prisma.transfer.update({
        where: { id: parseInt(id) },
        data: { status: 'Approuvé', approverId: userId }
      });
      return res.status(200).json({ success: true, message: 'Transfert approuvé avec succès', data: updated });
    } else if (status === 'Refusé') {
      const updated = await prisma.transfer.update({
        where: { id: parseInt(id) },
        data: { status: 'Refusé', approverId: userId, processedAt: new Date(), comments: motif || transfer.comments }
      });
      // Remettre le matériel disponible en cas de refus
      await prisma.material.update({ where: { id: transfer.materialId }, data: { status: 'Disponible' } });
      return res.status(200).json({ success: true, message: 'Transfert refusé', data: updated });
    } else {
      return res.status(400).json({ success: false, message: 'Statut invalide. Valeurs acceptées: Approuvé, Refusé' });
    }
  } catch (error) { next(error); }
};

export const receiveTransfer = async (req, res, next) => {
  // Utilisé par l'Admin Centre DESTINATION pour confirmer réception → statut "Complété"
  try {
    const { id } = req.params;
    const { role, centreId, id: userId } = req.user;

    const transfer = await prisma.transfer.findUnique({ 
      where: { id: parseInt(id) },
      include: { destinationCentre: true } 
    });
    
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfert introuvable' });

    // Seul l'Admin Centre du centre destinataire peut confirmer la réception
    const canReceive = role === 'Admin' || (role === 'Admin Centre' && transfer.destinationCentreId === centreId);
    if (!canReceive) {
      return res.status(403).json({ success: false, message: "Seul l'Admin Centre du centre destinataire peut confirmer la réception" });
    }
    if (transfer.status !== 'Approuvé') {
      return res.status(400).json({ success: false, message: "Le transfert doit d'abord être approuvé par le centre source" });
    }

    const updated = await prisma.transfer.update({
      where: { id: parseInt(id) },
      data: { status: 'Complété', processedAt: new Date(), approverId: userId }
    });

    // Affecter le matériel au centre destinataire
    await prisma.material.update({
      where: { id: transfer.materialId },
      data: { 
        centreId: transfer.destinationCentreId,
        currentService: transfer.destinationCentre.nom,
        status: 'Disponible' 
      }
    });

    return res.status(200).json({ success: true, message: 'Réception confirmée — transfert complété avec succès', data: updated });
  } catch (error) { next(error); }
};

export const getPendingCount = async (req, res, next) => {
  try {
    const { role, centreId } = req.user;
    if (role !== 'Admin Centre') {
      return res.status(200).json({ success: true, count: 0 });
    }
    // Transferts en attente dont le centre de l'Admin Centre est SOURCE
    const count = await prisma.transfer.count({
      where: {
        sourceCentreId: centreId,
        status: 'En attente'
      }
    });
    return res.status(200).json({ success: true, count });
  } catch (error) { next(error); }
};
