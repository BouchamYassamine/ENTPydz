import { Router } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';

// Middleware checkAdmin pour vérifier le rôle de req.user
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Accès interdit : rôle Administrateur requis.' });
  }
  next();
};

const router = Router();

// ==========================================
// MATERIELS
// ==========================================

// GET /api/materiels (avec filtre par catégorie et recherche)
router.get('/materiels', async (req, res) => {
  try {
    const { categorieId, search } = req.query;
    
    let whereClause = {};
    if (categorieId) {
      whereClause.categorieId = parseInt(categorieId);
    }
    if (search) {
      whereClause.designation = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const materiels = await prisma.materiel.findMany({
      where: whereClause,
      include: {
        categorie: true,
        centre: true
      }
    });
    res.json({ success: true, data: materiels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// CATEGORIES
// ==========================================

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        materiels: true
      }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// TRANSFERTS
// ==========================================

// POST /api/transferts (créer un transfert)
router.post('/transferts', async (req, res) => {
  try {
    const { materielId, centreEmetteurId, centreRecepteurId, motif, userId } = req.body;
    
    // 1. Créer le transfert
    const transfert = await prisma.transfert.create({
      data: {
        materielId: parseInt(materielId),
        centreEmetteurId: parseInt(centreEmetteurId),
        centreRecepteurId: parseInt(centreRecepteurId),
        motif,
        userId: parseInt(userId),
        statut: 'EN_ATTENTE'
      }
    });

    // 2. Mettre à jour le statut du matériel
    await prisma.materiel.update({
      where: { id: parseInt(materielId) },
      data: { statut: 'EN_TRANSFERT' }
    });

    res.status(201).json({ success: true, data: transfert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/transferts/envoyes/:centreId
router.get('/transferts/envoyes/:centreId', async (req, res) => {
  try {
    const { centreId } = req.params;
    const transferts = await prisma.transfert.findMany({
      where: { centreEmetteurId: parseInt(centreId) },
      include: {
        materiel: true,
        centreRecepteur: true,
        user: true
      },
      orderBy: { dateCreation: 'desc' }
    });
    res.json({ success: true, data: transferts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/transferts/recus/:centreId
router.get('/transferts/recus/:centreId', async (req, res) => {
  try {
    const { centreId } = req.params;
    const transferts = await prisma.transfert.findMany({
      where: { centreRecepteurId: parseInt(centreId) },
      include: {
        materiel: true,
        centreEmetteur: true,
        user: true
      },
      orderBy: { dateCreation: 'desc' }
    });
    res.json({ success: true, data: transferts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/transferts/:id/receptionner
router.patch('/transferts/:id/receptionner', async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le transfert pour connaître le matériel et le centre cible
    const transfert = await prisma.transfert.findUnique({
      where: { id: parseInt(id) }
    });

    if (!transfert) {
      return res.status(404).json({ success: false, message: 'Transfert introuvable' });
    }

    // 1. Mettre à jour le statut du transfert
    const updatedTransfert = await prisma.transfert.update({
      where: { id: parseInt(id) },
      data: { statut: 'RECU' }
    });

    // 2. Mettre à jour le matériel (nouveau centre et redevient disponible)
    await prisma.materiel.update({
      where: { id: transfert.materielId },
      data: { 
        centreId: transfert.centreRecepteurId,
        statut: 'DISPONIBLE'
      }
    });

    res.json({ success: true, data: updatedTransfert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// UTILISATEURS (Admin uniquement)
// ==========================================

// GET /api/users
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { centre: true },
      orderBy: { id: 'desc' }
    });
    // Ne pas renvoyer les mots de passe
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json({ success: true, data: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/:id
router.get('/users/:id', checkAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { centre: true }
    });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    
    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users
router.post('/users', checkAdmin, async (req, res) => {
  try {
    const { nom, email, password, role, centreId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        nom,
        email,
        password: hashedPassword,
        role: role || 'UTILISATEUR',
        centreId: parseInt(centreId)
      }
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/:id
router.put('/users/:id', checkAdmin, async (req, res) => {
  try {
    const { nom, email, password, role, centreId } = req.body;
    
    const dataToUpdate = { nom, email, role, centreId: parseInt(centreId) };
    
    if (password && password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: dataToUpdate
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:id
router.delete('/users/:id', checkAdmin, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
