import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority = 'medium' } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category required' });
    }

    const newTicket = new Ticket({
      title,
      description,
      category,
      priority,
      status: 'open',
      userId,
      assignedTo: null,
      notes: []
    });

    await newTicket.save();
    await newTicket.populate(['userId', 'assignedTo']);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: newTicket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: error.message || 'Failed to create ticket' });
  }
};

export const getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};

    if (role === 'user') {
      query.userId = userId;
    } else if (role === 'agent') {
      query.assignedTo = userId;
    }

    const tickets = await Ticket.find(query)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('notes.agentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tickets' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('notes.agentId', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Authorization check
    if (req.user.role === 'user' && ticket.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch ticket' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, priority, description } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (description) ticket.description = description;
    ticket.updatedAt = new Date();

    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update ticket' });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ error: 'Invalid agent' });
    }

    ticket.assignedTo = agentId;
    ticket.status = 'in-progress';
    await ticket.save();

    await ticket.populate(['userId', 'assignedTo']);

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to assign ticket' });
  }
};

export const addNoteToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Note content required' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.notes.push({
      agentId: req.user.id,
      content,
      createdAt: new Date()
    });

    await ticket.save();
    await ticket.populate(['userId', 'assignedTo', 'notes.agentId']);

    res.json({
      success: true,
      message: 'Note added successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to add note' });
  }
};

export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { resolution, rating, feedback } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.status = 'closed';
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date();
    if (rating) ticket.rating = rating;
    if (feedback) ticket.feedback = feedback;

    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket closed successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to close ticket' });
  }
};
