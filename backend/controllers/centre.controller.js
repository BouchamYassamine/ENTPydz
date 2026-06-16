import prisma from '../db.js';

/**
 * @desc    Liste tous les centres
 * @route   GET /api/centres
 */
export const getCentres = async (req, res, next) => {
  try {
    const { exclude } = req.query;
    const where = exclude ? { NOT: { id: parseInt(exclude) } } : {};

    const centres = await prisma.centre.findMany({
      where,
      include: {
        direction: { select: { id: true, code: true, nom: true } },
        _count: { select: { users: true, materiels: true } }
      },
      orderBy: [{ direction: { nom: 'asc' } }, { nom: 'asc' }]
    });
    return res.status(200).json({ success: true, data: centres });
  } catch (error) { next(error); }
};

/**
 * @desc    Détail d'un centre avec ses utilisateurs et matériels
 * @route   GET /api/centres/:id
 */
export const getCentreById = async (req, res, next) => {
  try {
    const centre = await prisma.centre.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        users: { select: { id: true, name: true, email: true, role: true, service: true, isActive: true } },
        materiels: { select: { id: true, barcode: true, name: true, status: true, categorie: true } },
        _count: { select: { users: true, materiels: true } }
      }
    });
    if (!centre) return res.status(404).json({ success: false, message: 'Centre introuvable' });
    return res.status(200).json({ success: true, data: centre });
  } catch (error) { next(error); }
};

export const createCentre = async (req, res, next) => {
  try {
    const { directionCode, nom, ville, wilaya, adresse, lieux } = req.body;

    if (!directionCode || !nom || !ville || !wilaya) {
      return res.status(400).json({ success: false, message: 'directionCode, nom, ville et wilaya sont requis' });
    }

    // Trouver ou créer la direction (optionnel selon le prompt)
    let direction = await prisma.direction.findUnique({ where: { code: directionCode } });
    if (!direction) {
       direction = await prisma.direction.create({ 
         data: { code: directionCode, nom: directionCode, branche: 'Autre' } 
       });
    }

    const existing = await prisma.centre.findFirst({ where: { nom } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un centre avec ce nom existe déjà' });
    }

    // Générer un code unique pour le centre
    const code = `${directionCode}-${Math.floor(Math.random()*10000)}`;

    const centre = await prisma.centre.create({
      data: { 
        code,
        nom, 
        ville, 
        wilaya,
        adresse: adresse || null,
        directionId: direction.id,
        lieux: lieux && lieux.length > 0 ? {
          create: lieux.map(l => ({ nom: l.nom, type: l.type }))
        } : undefined
      },
      include: { lieux: true, direction: true }
    });
    return res.status(201).json({ success: true, message: 'Centre créé avec succès', data: centre });
  } catch (error) { next(error); }
};

/**
 * @desc    Modifier un centre
 * @route   PUT /api/centres/:id
 */
export const updateCentre = async (req, res, next) => {
  try {
    const { nom, ville, adresse } = req.body;
    const id = parseInt(req.params.id);

    const existing = await prisma.centre.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Centre introuvable' });

    if (nom && nom !== existing.nom) {
      const dup = await prisma.centre.findFirst({ where: { nom } });
      if (dup) return res.status(409).json({ success: false, message: 'Un centre avec ce nom existe déjà' });
    }

    const centre = await prisma.centre.update({
      where: { id },
      data: {
        ...(nom && { nom }),
        ...(ville && { ville }),
        ...(adresse !== undefined && { adresse: adresse || null })
      }
    });
    return res.status(200).json({ success: true, message: 'Centre modifié avec succès', data: centre });
  } catch (error) { next(error); }
};

/**
 * @desc    Supprimer un centre (bloqué si utilisateurs ou matériels liés)
 * @route   DELETE /api/centres/:id
 */
export const deleteCentre = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const centre = await prisma.centre.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { users: true, materiels: true, sourceTransfers: true, destinationTransfers: true } 
        } 
      }
    });

    if (!centre) return res.status(404).json({ success: false, message: 'Centre introuvable' });

    const totalTransfers = centre._count.sourceTransfers + centre._count.destinationTransfers;

    if (centre._count.users > 0 || centre._count.materiels > 0 || totalTransfers > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ce centre est lié à ${centre._count.users} utilisateur(s), ${centre._count.materiels} matériel(s) et ${totalTransfers} transfert(s) historique(s).`
      });
    }

    // Supprimer les lieux associés pour éviter l'erreur de Foreign Key
    await prisma.lieu.deleteMany({ where: { centreId: id } });
    
    // Supprimer le centre
    await prisma.centre.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Centre supprimé avec succès' });
  } catch (error) { next(error); }
};

/**
 * @desc    Obtenir les lieux d'un centre
 * @route   GET /api/centres/:id/lieux
 */
export const getCentreLieux = async (req, res, next) => {
  try {
    const lieux = await prisma.lieu.findMany({
      where: { centreId: parseInt(req.params.id) },
      orderBy: { nom: 'asc' }
    });
    return res.status(200).json({ success: true, data: lieux });
  } catch (error) { next(error); }
};
