import { Ticket, User } from '../models/schemas.js';

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('userId', 'name email phone department')
      .populate('assignedTo', 'name email phone department')
      .populate('notes.agentId', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, userId } = req.body;

    // Validation
    if (!title || !description || !userId) {
      return res.status(400).json({ error: 'Title, description, and userId are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create ticket
    const newTicket = new Ticket({
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
      userId,
      status: 'open'
    });

    await newTicket.save();
    await newTicket.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status, assignedTo } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update fields if provided
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

    await ticket.save();
    await ticket.populate('userId', 'name email');
    await ticket.populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

// Assign ticket to agent
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    // Check if agent exists and is an agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { assignedTo: agentId, status: 'in-progress' },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
};

// Add note to ticket
export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId, content } = req.body;

    if (!agentId || !content) {
      return res.status(400).json({ error: 'Agent ID and content are required' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.notes.push({
      agentId,
      content,
      createdAt: new Date()
    });

    await ticket.save();
    await ticket.populate('notes.agentId', 'name email');

    res.json({
      success: true,
      message: 'Note added successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
};

// Close/Resolve ticket
export const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, rating, feedback } = req.body;

    const ticket = await Ticket.findById(id);
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
      data: ticket
    });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({ error: 'Failed to close ticket' });
  }
};

// Get tickets by user
export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticket.find({ userId })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ error: 'Failed to fetch user tickets' });
  }
};

// Get tickets by agent
export const getAgentTickets = async (req, res) => {
  try {
    const { agentId } = req.params;

    const tickets = await Ticket.find({ assignedTo: agentId })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching agent tickets:', error);
    res.status(500).json({ error: 'Failed to fetch agent tickets' });
  }
};

// Get tickets by status
export const getTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const tickets = await Ticket.find({ status })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets by status:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};
