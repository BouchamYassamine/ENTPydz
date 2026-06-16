import { Router } from 'express';
import { getCentres, getCentreById, createCentre, updateCentre, deleteCentre } from '../controllers/centre.controller.js';
import { protect, checkAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(checkAdmin);

router.route('/')
  .get(getCentres)
  .post(createCentre);

router.route('/:id')
  .get(getCentreById)
  .put(updateCentre)
  .delete(deleteCentre);

export default router;
