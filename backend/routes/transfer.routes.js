import { Router } from 'express';
import { getTransfers, createTransfer, updateTransferStatus } from '../controllers/transfer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes de transfert exigent d'être connecté
router.use(protect);

router.route('/')
  .get(getTransfers) // Filtré par service/rôle dans le contrôleur
  .post(createTransfer); // Contrôlé par le service source dans le contrôleur

router.route('/:id/status')
  .put(updateTransferStatus); // Validation/Réception gérée dans le contrôleur

export default router;
