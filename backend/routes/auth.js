import express from 'express';
import { login, register, forgotPassword, verifyToken } from '../controllers/authController_MongoDB.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/verify', authenticate, verifyToken);

export default router;
