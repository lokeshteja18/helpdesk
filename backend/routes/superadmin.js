import express from 'express';
import { authMiddleware, superAdminOnly } from '../middleware/auth.js';
import {
  getSuperAdminDashboard,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getSystemSettings,
  getSuperAdminProfile
} from '../controllers/superadminController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, superAdminOnly, getSuperAdminDashboard);
router.get('/users', authMiddleware, superAdminOnly, getAllUsers);
router.get('/users/:userId', authMiddleware, superAdminOnly, getUserById);
router.post('/users', authMiddleware, superAdminOnly, createUser);
router.put('/users/:userId', authMiddleware, superAdminOnly, updateUser);
router.delete('/users/:userId', authMiddleware, superAdminOnly, deleteUser);
router.get('/settings', authMiddleware, superAdminOnly, getSystemSettings);
router.get('/profile', authMiddleware, superAdminOnly, getSuperAdminProfile);

export default router;
