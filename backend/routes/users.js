import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getUserDashboard,
  getUserProfile,
  updateUserProfile,
  getMyTickets
} from '../controllers/userController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, getUserDashboard);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/my-tickets', authMiddleware, getMyTickets);

export default router;
