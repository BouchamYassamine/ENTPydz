import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect, checkAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes utilisateurs nécessitent d'être connecté ET d'avoir le rôle Admin
router.use(protect);
router.use(checkAdmin);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;
