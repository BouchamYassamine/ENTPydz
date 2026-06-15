import { Router } from 'express';
import { getTransfers, createTransfer, updateTransferStatus } from '../controllers/transfer.controller.js';
<<<<<<< HEAD
import { protect } from '../middlewares/auth.middleware.js';
=======
import { protect, authorize } from '../middlewares/auth.middleware.js';
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

const router = Router();

// Toutes les routes de transfert exigent d'être connecté
router.use(protect);

router.route('/')
<<<<<<< HEAD
  .get(getTransfers) // Filtré par service/rôle dans le contrôleur
  .post(createTransfer); // Contrôlé par le service source dans le contrôleur

router.route('/:id/status')
  .put(updateTransferStatus); // Validation/Réception gérée dans le contrôleur
=======
  .get(getTransfers) // Accessible par tout utilisateur connecté (filtré par service)
  .post(authorize('Admin', 'Responsable Service'), createTransfer); // Seuls admins/responsables émettent

router.route('/:id/status')
  .put(authorize('Admin', 'Responsable Service'), updateTransferStatus); // Validation des transferts
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

export default router;
