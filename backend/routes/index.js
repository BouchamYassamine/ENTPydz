import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transferRoutes from './transfer.routes.js';
import materialRoutes from './material.routes.js';
import centreRoutes from './centre.routes.js';
import categoryRoutes from './category.routes.js';

const router = Router();

// Agrégation des routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transfers', transferRoutes);
router.use('/materials', materialRoutes);
router.use('/centres', centreRoutes);
router.use('/categories', categoryRoutes);

export default router;
