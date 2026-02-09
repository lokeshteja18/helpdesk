import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import {
  getAdminDashboard,
  getAllTickets,
  assignTicket,
  getReports,
  getAdminProfile
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminOnly, getAdminDashboard);
router.get('/tickets', authMiddleware, adminOnly, getAllTickets);
router.put('/ticket/:ticketId/assign', authMiddleware, adminOnly, assignTicket);
router.get('/reports', authMiddleware, adminOnly, getReports);
router.get('/profile', authMiddleware, adminOnly, getAdminProfile);

export default router;
