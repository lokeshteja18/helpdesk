import express from 'express';
import { authMiddleware, agentOnly } from '../middleware/auth.js';
import {
  getAgentDashboard,
  getAssignedTickets,
  updateTicketStatus,
  addTicketNote,
  getAgentProfile
} from '../controllers/agentController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, agentOnly, getAgentDashboard);
router.get('/assigned-tickets', authMiddleware, agentOnly, getAssignedTickets);
router.put('/ticket/:ticketId/status', authMiddleware, agentOnly, updateTicketStatus);
router.post('/ticket/:ticketId/note', authMiddleware, agentOnly, addTicketNote);
router.get('/profile', authMiddleware, agentOnly, getAgentProfile);

export default router;
