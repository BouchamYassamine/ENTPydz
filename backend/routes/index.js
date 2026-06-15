import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transferRoutes from './transfer.routes.js';

const router = Router();

// Agrégation des routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transfers', transferRoutes);

export default router;
