import { database } from '../models/database.js';

export const getSuperAdminDashboard = (req, res) => {
  try {
    const totalUsers = database.users.length;
    const staffMembers = database.users.filter(u => u.role !== 'user').length;
    const totalTickets = database.tickets.length;
    const openTickets = database.tickets.filter(t => t.status === 'open').length;

    // User breakdown
    const userBreakdown = {
      users: database.users.filter(u => u.role === 'user').length,
      agents: database.users.filter(u => u.role === 'agent').length,
      admins: database.users.filter(u => u.role === 'admin').length,
      superadmins: database.users.filter(u => u.role === 'superadmin').length
    };

    res.json({
      dashboard: {
        stats: {
          totalUsers,
          staffMembers,
          totalTickets,
          openTickets
        },
        userBreakdown,
        recentUsers: database.users.slice(0, 5),
        recentTickets: database.tickets.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = (req, res) => {
  try {
    const users = database.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }));

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = (req, res) => {
  try {
    const { userId } = req.params;
    const user = database.users.find(u => u.id === parseInt(userId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }

    const existingUser = database.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: Math.max(...database.users.map(u => u.id), 0) + 1,
      name,
      email,
      password,
      role,
      createdAt: new Date(),
      isActive: true,
      department: '',
      phone: ''
    };

    database.users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role, isActive, department, phone } = req.body;

    const user = database.users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (department) user.department = department;
    if (phone) user.phone = phone;

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = (req, res) => {
  try {
    const { userId } = req.params;
    const index = database.users.findIndex(u => u.id === parseInt(userId));

    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = database.users.splice(index, 1);

    res.json({
      message: 'User deleted successfully',
      user: deletedUser[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSystemSettings = (req, res) => {
  try {
    const settings = {
      ticketPriorities: ['low', 'medium', 'high', 'critical'],
      ticketStatuses: ['open', 'in-progress', 'closed', 'on-hold'],
      categories: ['account', 'technical', 'security', 'billing', 'general'],
      roles: ['user', 'agent', 'admin', 'superadmin'],
      maxTicketsPerAgent: 10,
      sla: {
        low: 72,
        medium: 48,
        high: 24,
        critical: 4
      }
    };

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSuperAdminProfile = (req, res) => {
  try {
    const admin = database.users.find(u => u.id === req.user.id);

    if (!admin) {
      return res.status(404).json({ error: 'Super Admin not found' });
    }

    res.json({
      profile: admin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
