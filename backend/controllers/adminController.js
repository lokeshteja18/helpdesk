import { database } from '../models/database.js';

export const getAdminDashboard = (req, res) => {
  try {
    const totalTickets = database.tickets.length;
    const openTickets = database.tickets.filter(t => t.status === 'open').length;
    const closedTickets = database.tickets.filter(t => t.status === 'closed').length;
    const inProgressTickets = database.tickets.filter(t => t.status === 'in-progress').length;

    // Agent performance
    const agents = database.users.filter(u => u.role === 'agent');
    const agentPerformance = agents.map(agent => {
      const assigned = database.tickets.filter(t => t.assignedTo === agent.id).length;
      const resolved = database.tickets.filter(t => t.assignedTo === agent.id && t.status === 'closed').length;
      return {
        agentId: agent.id,
        agentName: agent.name,
        assigned,
        resolved
      };
    });

    res.json({
      dashboard: {
        stats: {
          totalTickets,
          openTickets,
          closedTickets,
          inProgressTickets
        },
        agentPerformance,
        recentTickets: database.tickets.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTickets = (req, res) => {
  try {
    const tickets = database.tickets.map(ticket => ({
      ...ticket,
      userName: database.users.find(u => u.id === ticket.userId)?.name,
      agentName: ticket.assignedTo ? database.users.find(u => u.id === ticket.assignedTo)?.name : 'Unassigned'
    }));

    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignTicket = (req, res) => {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;

    const ticket = database.tickets.find(t => t.id === parseInt(ticketId));
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const agent = database.users.find(u => u.id === parseInt(agentId) && u.role === 'agent');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    ticket.assignedTo = parseInt(agentId);
    ticket.updatedAt = new Date();

    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReports = (req, res) => {
  try {
    const totalTickets = database.tickets.length;
    const byStatus = {
      open: database.tickets.filter(t => t.status === 'open').length,
      inProgress: database.tickets.filter(t => t.status === 'in-progress').length,
      closed: database.tickets.filter(t => t.status === 'closed').length
    };

    const byPriority = {
      high: database.tickets.filter(t => t.priority === 'high').length,
      medium: database.tickets.filter(t => t.priority === 'medium').length,
      low: database.tickets.filter(t => t.priority === 'low').length
    };

    const byCategory = {};
    database.tickets.forEach(ticket => {
      byCategory[ticket.category] = (byCategory[ticket.category] || 0) + 1;
    });

    res.json({
      reports: {
        totalTickets,
        byStatus,
        byPriority,
        byCategory,
        avgResolutionTime: '5 hours',
        satisfactionRate: 87
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminProfile = (req, res) => {
  try {
    const admin = database.users.find(u => u.id === req.user.id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      profile: admin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
