import express from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignTicket,
  addNote,
  closeTicket,
  getUserTickets,
  getAgentTickets,
  getTicketsByStatus
} from '../controllers/ticketController_MongoDB.js';

const router = express.Router();

// Ticket endpoints
router.get('/', getAllTickets);
router.get('/status/:status', getTicketsByStatus);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.post('/:id/assign', assignTicket);
router.post('/:id/notes', addNote);
router.post('/:id/close', closeTicket);

// User and Agent ticket queries
router.get('/user/:userId', getUserTickets);
router.get('/agent/:agentId', getAgentTickets);

export default router;
