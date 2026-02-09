// User Model
export class User {
  constructor(id, name, email, password, role, createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'user', 'agent', 'admin', 'superadmin'
    this.createdAt = createdAt;
    this.isActive = true;
    this.department = '';
    this.phone = '';
  }
}

// In-memory database for development
export const database = {
  users: [
    new User(1, 'Super Admin', 'superadmin@gmail.com', 'superadmin123', 'superadmin'),
    new User(2, 'Admin', 'admin@gmail.com', 'admin123', 'admin'),
    new User(3, 'Agent John', 'agent@gmail.com', 'agent123', 'agent'),
    new User(4, 'John Doe', 'user@gmail.com', 'user123', 'user'),
    new User(5, 'Jane Smith', 'jane@gmail.com', 'jane123', 'user'),
  ],
  tickets: [
    {
      id: 1,
      userId: 4,
      title: 'Login Issue',
      description: 'Cannot login to my account',
      status: 'open',
      priority: 'high',
      category: 'account',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      assignedTo: 3,
      notes: []
    },
    {
      id: 2,
      userId: 5,
      title: 'Password Reset',
      description: 'Need to reset password',
      status: 'in-progress',
      priority: 'medium',
      category: 'security',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-17'),
      assignedTo: 3,
      notes: []
    },
    {
      id: 3,
      userId: 4,
      title: 'Data Export Issue',
      description: 'Cannot export data',
      status: 'closed',
      priority: 'low',
      category: 'technical',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      assignedTo: 3,
      notes: []
    }
  ],
  notes: [],
  assignments: []
};

// Initialize database
export function initializeDatabase() {
  // Database already initialized above
  return database;
}
