import { Router } from 'express';
import { getCentres, getCentreById, createCentre, updateCentre, deleteCentre } from '../controllers/centre.controller.js';
import { protect, checkAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes nécessitent d'être authentifié
router.use(protect);

// GET : accessible à tous les utilisateurs authentifiés
// (nécessaire pour afficher la liste des centres destination dans le formulaire)
router.get('/', getCentres);
router.get('/:id', getCentreById);

// POST / PUT / DELETE : réservé aux admins
router.post('/', checkAdmin, createCentre);
router.put('/:id', checkAdmin, updateCentre);
router.delete('/:id', checkAdmin, deleteCentre);

export default router;
