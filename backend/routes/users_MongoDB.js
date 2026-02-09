import express from 'express';
import { User } from '../models/schemas.js';
import { authenticate, isAgent, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, department, avatar } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot update other users' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, phone, department, avatar },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all agents
router.get('/role/agent', authenticate, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

export default router;
