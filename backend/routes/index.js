import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transferRoutes from './transfer.routes.js';
<<<<<<< HEAD
import materialRoutes from './material.routes.js';
=======
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

const router = Router();

// Agrégation des routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transfers', transferRoutes);
<<<<<<< HEAD
router.use('/materials', materialRoutes);
=======
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

export default router;
