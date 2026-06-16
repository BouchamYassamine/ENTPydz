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
    // Admin Centre et Utilisateur ne voient que les matériels de LEUR centre
    if (role === 'Admin Centre' || role === 'Utilisateur') {
      where.centreId = userCentreId;
    } else {
      if (categorieId) where.categorie = categorieId; // `categorieId` now holds the string name
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

    const { 
      barcode, codeInventaire, name, description, categorie, sousCategorie, 
      marque, modele, numeroSerie, anneeService, valeurEstimee, 
      etatGeneral, photo, status, centreId, lieuId 
    } = req.body;

    if (!barcode || !codeInventaire || !name || !categorie || !centreId || !etatGeneral || !status) {
      return res.status(400).json({ success: false, message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Admin Centre ne peut créer qu'un matériel pour SON centre
    const targetCentreId = role === 'Admin Centre' ? userCentreId : parseInt(centreId);

    const dupBarcode = await prisma.material.findUnique({ where: { barcode } });
    if (dupBarcode) return res.status(409).json({ success: false, message: 'Ce code barre existe déjà' });

    const dupInv = await prisma.material.findUnique({ where: { codeInventaire } });
    if (dupInv) return res.status(409).json({ success: false, message: 'Ce code inventaire existe déjà' });

    const material = await prisma.material.create({
      data: {
        barcode,
        codeInventaire,
        name,
        description,
        categorie,
        sousCategorie,
        marque,
        modele,
        numeroSerie,
        anneeService: anneeService ? parseInt(anneeService) : null,
        valeurEstimee: valeurEstimee ? parseFloat(valeurEstimee) : null,
        etatGeneral,
        photo,
        status,
        centreId: targetCentreId,
        lieuId: lieuId ? parseInt(lieuId) : null
      },
      include: {
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
    
    const { 
      barcode, codeInventaire, name, description, categorie, sousCategorie, 
      marque, modele, numeroSerie, anneeService, valeurEstimee, 
      etatGeneral, photo, status, centreId, lieuId 
    } = req.body;

    const existing = await prisma.material.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Matériel introuvable' });

    if (role === 'Admin Centre' && existing.centreId !== userCentreId) {
      return res.status(403).json({ success: false, message: 'Vous ne pouvez modifier que les matériels de votre centre' });
    }
    if (role === 'Utilisateur') {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    if (barcode && barcode !== existing.barcode) {
      const dup = await prisma.material.findUnique({ where: { barcode } });
      if (dup) return res.status(409).json({ success: false, message: 'Ce code barre est déjà utilisé' });
    }

    if (codeInventaire && codeInventaire !== existing.codeInventaire) {
      const dup = await prisma.material.findUnique({ where: { codeInventaire } });
      if (dup) return res.status(409).json({ success: false, message: 'Ce code inventaire est déjà utilisé' });
    }

    const targetCentreId = (centreId !== undefined && role === 'Admin') ? parseInt(centreId) : existing.centreId;

    const material = await prisma.material.update({
      where: { id },
      data: {
        ...(barcode && { barcode }),
        ...(codeInventaire && { codeInventaire }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(categorie && { categorie }),
        ...(sousCategorie !== undefined && { sousCategorie }),
        ...(marque !== undefined && { marque }),
        ...(modele !== undefined && { modele }),
        ...(numeroSerie !== undefined && { numeroSerie }),
        ...(anneeService !== undefined && { anneeService: anneeService ? parseInt(anneeService) : null }),
        ...(valeurEstimee !== undefined && { valeurEstimee: valeurEstimee ? parseFloat(valeurEstimee) : null }),
        ...(etatGeneral && { etatGeneral }),
        ...(photo !== undefined && { photo }),
        ...(status && { status }),
        centreId: targetCentreId,
        ...(lieuId !== undefined && { lieuId: lieuId ? parseInt(lieuId) : null })
      },
      include: {
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

/**
 * @desc    Vérifier la disponibilité d'un code barre
 * @route   GET /api/materiels/check-barcode?code=X
 */
export const checkBarcode = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ success: false, message: 'Code barre requis' });
    const existing = await prisma.material.findUnique({ where: { barcode: code } });
    return res.status(200).json({ success: true, available: !existing });
  } catch (error) { next(error); }
};

/**
 * @desc    Vérifier la disponibilité d'un code inventaire
 * @route   GET /api/materiels/check-inventaire?code=X
 */
export const checkInventaire = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ success: false, message: 'Code inventaire requis' });
    const existing = await prisma.material.findUnique({ where: { codeInventaire: code } });
    return res.status(200).json({ success: true, available: !existing });
  } catch (error) { next(error); }
};
