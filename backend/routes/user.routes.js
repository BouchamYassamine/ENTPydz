import { Router } from 'express';
import { getUsers, createUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes utilisateurs nécessitent d'être connecté ET d'avoir le rôle Admin
router.use(protect);
router.use(authorize('Admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

export default router;
