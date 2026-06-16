import { Router } from 'express';
import { 
  getTransfers, 
  getTransfertsEnvoyes, 
  getTransfertsRecus, 
  createTransfer, 
  validateTransfer, 
  receiveTransfer,
  getPendingCount,
  getTransferById
} from '../controllers/transfer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/pending-count', getPendingCount);

router.route('/')
  .get(getTransfers)
  .post(createTransfer);

router.get('/envoyes/:centreId', getTransfertsEnvoyes);
router.get('/recus/:centreId', getTransfertsRecus);

router.get('/:id', getTransferById);
router.patch('/:id/validate', validateTransfer);
router.patch('/:id/receive', receiveTransfer);

export default router;
