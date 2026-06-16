import { Router } from 'express';
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller.js';
import { protect, checkAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes nécessitent d'être authentifié
router.use(protect);

// GET : accessible à tous les utilisateurs authentifiés
router.get('/', getMaterials);
router.get('/:id', getMaterialById);

// POST / PUT / DELETE : réservé aux admins
router.post('/', checkAdmin, createMaterial);
router.put('/:id', checkAdmin, updateMaterial);
router.delete('/:id', checkAdmin, deleteMaterial);

export default router;
