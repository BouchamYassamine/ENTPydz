import prisma from '../db.js';

/**
 * @desc    Liste tous les matériels avec filtres
 * @route   GET /api/materiels?categorieId=&centreId=&search=&statut=
 */
export const getMaterials = async (req, res, next) => {
  try {
    const { categorieId, centreId, search, statut } = req.query;
    const { role, centreId: userCentreId } = req.user;

    const where = {};
    // Admin Centre ne voit que les matériels de SON centre
    if (role === 'Admin Centre') {
      where.centreId = userCentreId;
    } else {
      if (categorieId) where.categoryId = parseInt(categorieId);
      if (centreId) where.centreId = parseInt(centreId);
    }
    if (statut) where.status = statut;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { barcode: { contains: search } }
      ];
    }

    const materials = await prisma.material.findMany({
      where,
      include: {
        category: { select: { id: true, nom: true } },
        centre: { select: { id: true, nom: true, ville: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, data: materials });
  } catch (error) { next(error); }
};

/**
 * @desc    Détail d'un matériel avec historique transferts
 * @route   GET /api/materiels/:id
 */
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: { select: { id: true, nom: true } },
        centre: { select: { id: true, nom: true, ville: true } },
        transfers: {
          include: {
            requester: { select: { id: true, name: true, email: true } },
            approver: { select: { id: true, name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });
    return res.status(200).json({ success: true, data: material });
  } catch (error) { next(error); }
};

/**
 * @desc    Créer un matériel
 * @route   POST /api/materiels
 */
export const createMaterial = async (req, res, next) => {
  try {
    const { role, centreId: userCentreId } = req.user;

    // Seul Admin et Admin Centre peuvent créer un matériel
    if (role === 'Utilisateur') {
      return res.status(403).json({ success: false, message: 'Non autorisé : seuls les administrateurs peuvent ajouter des matériels' });
    }

    const { codeBarre, designation, categorieId, centreId, statut } = req.body;

    if (!codeBarre || !designation) {
      return res.status(400).json({ success: false, message: 'Le code barre et la désignation sont requis' });
    }

    // Admin Centre ne peut créer qu'un matériel pour SON centre
    const targetCentreId = role === 'Admin Centre' ? userCentreId : (centreId ? parseInt(centreId) : null);

    const existing = await prisma.material.findUnique({ where: { barcode: codeBarre } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un matériel avec ce code barre existe déjà' });
    }

    let currentService = '';
    if (targetCentreId) {
      const centre = await prisma.centre.findUnique({ where: { id: targetCentreId } });
      if (centre) currentService = centre.nom;
    }

    const material = await prisma.material.create({
      data: {
        barcode: codeBarre,
        name: designation,
        currentService,
        status: statut || 'Disponible',
        categoryId: categorieId ? parseInt(categorieId) : null,
        centreId: targetCentreId
      },
      include: {
        category: { select: { id: true, nom: true } },
        centre: { select: { id: true, nom: true } }
      }
    });

    return res.status(201).json({ success: true, message: 'Matériel créé avec succès', data: material });
  } catch (error) { next(error); }
};

/**
 * @desc    Modifier un matériel
 * @route   PUT /api/materiels/:id
 */
export const updateMaterial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { role, centreId: userCentreId } = req.user;
    const { codeBarre, designation, categorieId, centreId, statut } = req.body;

    const existing = await prisma.material.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Matériel introuvable' });

    // Admin Centre ne peut modifier que les matériels de SON centre
    if (role === 'Admin Centre' && existing.centreId !== userCentreId) {
      return res.status(403).json({ success: false, message: 'Vous ne pouvez modifier que les matériels de votre centre' });
    }
    if (role === 'Utilisateur') {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    if (codeBarre && codeBarre !== existing.barcode) {
      const dup = await prisma.material.findUnique({ where: { barcode: codeBarre } });
      if (dup) return res.status(409).json({ success: false, message: 'Ce code barre est déjà utilisé' });
    }

    const updateData = {};
    if (codeBarre) updateData.barcode = codeBarre;
    if (designation) updateData.name = designation;
    if (statut) updateData.status = statut;
    if (categorieId !== undefined) updateData.categoryId = categorieId ? parseInt(categorieId) : null;
    // Admin Centre ne peut pas changer le centreId (matériel resté dans son centre)
    if (centreId !== undefined && role === 'Admin') {
      updateData.centreId = centreId ? parseInt(centreId) : null;
      if (centreId) {
        const centre = await prisma.centre.findUnique({ where: { id: parseInt(centreId) } });
        if (centre) updateData.currentService = centre.nom;
      }
    }

    const material = await prisma.material.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, nom: true } },
        centre: { select: { id: true, nom: true } }
      }
    });

    return res.status(200).json({ success: true, message: 'Matériel modifié avec succès', data: material });
  } catch (error) { next(error); }
};

/**
 * @desc    Supprimer un matériel (bloqué si transfert en attente)
 * @route   DELETE /api/materiels/:id
 */
export const deleteMaterial = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { role, centreId: userCentreId } = req.user;

    const material = await prisma.material.findUnique({
      where: { id },
      include: { transfers: { where: { status: { in: ['En attente', 'Approuvé'] } } } }
    });

    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });

    // Admin Centre ne peut supprimer que les matériels de SON centre
    if (role === 'Admin Centre' && material.centreId !== userCentreId) {
      return res.status(403).json({ success: false, message: 'Vous ne pouvez supprimer que les matériels de votre centre' });
    }
    if (role === 'Utilisateur') {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    if (material.transfers.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${material.transfers.length} transfert(s) actif(s) pour ce matériel.`
      });
    }

    // Supprimer l'historique des transferts complétés/refusés avant suppression
    await prisma.transfer.deleteMany({ where: { materialId: id } });
    await prisma.material.delete({ where: { id } });

    return res.status(200).json({ success: true, message: 'Matériel supprimé avec succès' });
  } catch (error) { next(error); }
};
