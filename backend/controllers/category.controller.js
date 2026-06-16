import prisma from '../db.js';

/**
 * @desc    Liste toutes les catégories
 * @route   GET /api/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { materials: true } } },
      orderBy: { nom: 'asc' }
    });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) { next(error); }
};

/**
 * @desc    Créer une catégorie
 * @route   POST /api/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ success: false, message: 'Le nom est requis' });

    const existing = await prisma.category.findUnique({ where: { nom } });
    if (existing) return res.status(409).json({ success: false, message: 'Cette catégorie existe déjà' });

    const category = await prisma.category.create({ data: { nom } });
    return res.status(201).json({ success: true, message: 'Catégorie créée avec succès', data: category });
  } catch (error) { next(error); }
};

/**
 * @desc    Modifier une catégorie
 * @route   PUT /api/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { nom } = req.body;
    const id = parseInt(req.params.id);

    if (!nom) return res.status(400).json({ success: false, message: 'Le nom est requis' });

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Catégorie introuvable' });

    if (nom !== existing.nom) {
      const dup = await prisma.category.findUnique({ where: { nom } });
      if (dup) return res.status(409).json({ success: false, message: 'Une catégorie avec ce nom existe déjà' });
    }

    const category = await prisma.category.update({ where: { id }, data: { nom } });
    return res.status(200).json({ success: true, message: 'Catégorie modifiée avec succès', data: category });
  } catch (error) { next(error); }
};

/**
 * @desc    Supprimer une catégorie (bloqué si matériels liés)
 * @route   DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { materials: true } } }
    });

    if (!category) return res.status(404).json({ success: false, message: 'Catégorie introuvable' });

    if (category._count.materials > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${category._count.materials} matériel(s) sont liés à cette catégorie.`
      });
    }

    await prisma.category.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Catégorie supprimée avec succès' });
  } catch (error) { next(error); }
};
