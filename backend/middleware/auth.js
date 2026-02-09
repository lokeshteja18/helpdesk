import jwt from 'jsonwebtoken';
import { User } from '../models/schemas.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authMiddleware = authenticate;

export const isAgent = (req, res, next) => {
  if (req.user.role !== 'agent' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Agents only' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Superadmin access required' });
  }
  next();
};

// Legacy exports for backwards compatibility
export const adminOnly = isAdmin;
export const superAdminOnly = isSuperAdmin;
export const agentOnly = isAgent;
