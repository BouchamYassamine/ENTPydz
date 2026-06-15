import prisma from '../db.js';

export const getMaterials = async (req, res, next) => {
  try {
    const { role, service } = req.user;
    
    let whereClause = {};
    if (role !== 'Admin') {
      whereClause = { currentService: service };
    }

    const materials = await prisma.material.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, data: materials });
  } catch (error) { next(error); }
};

export const createMaterial = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Non autorisé' });
    const material = await prisma.material.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Matériel créé avec succès', data: material });
  } catch (error) { next(error); }
};

export const updateMaterial = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Non autorisé' });
    const { id } = req.params;
    const material = await prisma.material.findUnique({ where: { id: parseInt(id) } });
    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });
    const updated = await prisma.material.update({ where: { id: parseInt(id) }, data: req.body });
    return res.status(200).json({ success: true, message: 'Matériel mis à jour avec succès', data: updated });
  } catch (error) { next(error); }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Non autorisé' });
    const { id } = req.params;
    const material = await prisma.material.findUnique({ where: { id: parseInt(id) } });
    if (!material) return res.status(404).json({ success: false, message: 'Matériel introuvable' });
    await prisma.material.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: 'Matériel supprimé avec succès' });
  } catch (error) { next(error); }
};
