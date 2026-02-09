import { database } from '../models/database.js';

export const getAgentDashboard = (req, res) => {
  try {
    const agentId = req.user.id;

    const assignedTickets = database.tickets.filter(t => t.assignedTo === agentId);
    const resolvedTickets = assignedTickets.filter(t => t.status === 'closed').length;
    const pendingTickets = assignedTickets.filter(t => t.status === 'in-progress').length;
    const totalAssigned = assignedTickets.length;

    const performanceData = {
      totalAssigned,
      resolved: resolvedTickets,
      pending: pendingTickets,
      avgResolutionTime: '4.5 hours',
      qualityScore: 4.7
    };

    res.json({
      dashboard: {
        assignedTickets: totalAssigned,
        resolvedTickets,
        pendingTickets,
        performance: performanceData,
        recentTickets: assignedTickets.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignedTickets = (req, res) => {
  try {
    const agentId = req.user.id;
    const tickets = database.tickets.filter(t => t.assignedTo === agentId);

    res.json({
      tickets: tickets.map(ticket => ({
        ...ticket,
        userName: database.users.find(u => u.id === ticket.userId)?.name
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTicketStatus = (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, notes } = req.body;

    const ticket = database.tickets.find(t => t.id === parseInt(ticketId));
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.assignedTo !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your assigned ticket' });
    }

    ticket.status = status;
    ticket.updatedAt = new Date();

    if (notes) {
      ticket.notes = ticket.notes || [];
      ticket.notes.push({
        author: req.user.name,
        text: notes,
        timestamp: new Date()
      });
    }

    res.json({
      message: 'Ticket status updated',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTicketNote = (req, res) => {
  try {
    const { ticketId } = req.params;
    const { note } = req.body;

    const ticket = database.tickets.find(t => t.id === parseInt(ticketId));
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (!ticket.notes) {
      ticket.notes = [];
    }

    ticket.notes.push({
      author: req.user.name,
      text: note,
      timestamp: new Date()
    });

    res.json({
      message: 'Note added successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgentProfile = (req, res) => {
  try {
    const agent = database.users.find(u => u.id === req.user.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const assignedTickets = database.tickets.filter(t => t.assignedTo === agent.id);
    const resolvedCount = assignedTickets.filter(t => t.status === 'closed').length;

    res.json({
      profile: {
        ...agent,
        stats: {
          assigned: assignedTickets.length,
          resolved: resolvedCount,
          avgRating: 4.7
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
