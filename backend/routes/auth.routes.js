import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/login', login);

// Routes protégées
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
