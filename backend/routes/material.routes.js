import { Router } from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getMaterials)
  .post(authorize('Admin'), createMaterial);

router.route('/:id')
  .put(authorize('Admin'), updateMaterial)
  .delete(authorize('Admin'), deleteMaterial);

export default router;
