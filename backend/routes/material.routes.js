import { Router } from 'express';
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller.js';
import { protect, checkAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(checkAdmin);

router.route('/')
  .get(getMaterials)
  .post(createMaterial);

router.route('/:id')
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

export default router;
