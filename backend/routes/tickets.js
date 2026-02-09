import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  assignTicket,
  addNote
} from '../controllers/ticketController_MongoDB.js';

const router = express.Router();

router.post('/', authenticate, createTicket);
router.get('/', authenticate, getAllTickets);
router.get('/:ticketId', authenticate, getTicketById);
router.put('/:ticketId', authenticate, updateTicket);
router.post('/:ticketId/assign', authenticate, assignTicket);
router.post('/:ticketId/notes', authenticate, addNote);
router.put('/:ticketId/close', authenticate, closeTicket);

export default router;
