import { database } from '../models/database.js';

export const getUserDashboard = (req, res) => {
  try {
    const userId = req.user.id;

    const userTickets = database.tickets.filter(t => t.userId === userId);
    const totalTickets = userTickets.length;
    const openTickets = userTickets.filter(t => t.status === 'open').length;
    const closedTickets = userTickets.filter(t => t.status === 'closed').length;
    const inProgressTickets = userTickets.filter(t => t.status === 'in-progress').length;

    res.json({
      dashboard: {
        totalTickets,
        openTickets,
        closedTickets,
        inProgressTickets,
        recentTickets: userTickets.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = (req, res) => {
  try {
    const user = database.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        isActive: user.isActive,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const user = database.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;

    res.json({
      message: 'Profile updated successfully',
      profile: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyTickets = (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = database.tickets.filter(t => t.userId === userId);

    res.json({
      tickets: tickets.map(ticket => ({
        ...ticket,
        agentName: ticket.assignedTo ? database.users.find(u => u.id === ticket.assignedTo)?.name : 'Unassigned'
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
