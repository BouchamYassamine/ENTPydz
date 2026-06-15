import { Router } from 'express';
import { getTransfers, createTransfer, updateTransferStatus } from '../controllers/transfer.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes de transfert exigent d'être connecté
router.use(protect);

router.route('/')
  .get(getTransfers) // Accessible par tout utilisateur connecté (filtré par service)
  .post(authorize('Admin', 'Responsable Service'), createTransfer); // Seuls admins/responsables émettent

router.route('/:id/status')
  .put(authorize('Admin', 'Responsable Service'), updateTransferStatus); // Validation des transferts

export default router;
