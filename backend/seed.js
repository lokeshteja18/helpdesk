import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User, Ticket } from './models/schemas.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding MongoDB database...');

    // Drop existing collections
    try {
      await mongoose.connection.collection('users').deleteMany({});
      await mongoose.connection.collection('tickets').deleteMany({});
      // Drop and recreate indexes
      await mongoose.connection.collection('tickets').dropIndexes().catch(() => {});
    } catch (error) {
      console.log('Collections cleanup:', error.message);
    }

    // Create sample users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: 'superadmin123',
        role: 'superadmin',
        phone: '+1234567890',
        department: 'Management',
        isActive: true,
      },
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567891',
        department: 'Management',
        isActive: true,
      },
      {
        name: 'Agent John',
        email: 'agent1@gmail.com',
        password: 'agent123',
        role: 'agent',
        phone: '+1234567892',
        department: 'Support',
        isActive: true,
      },
      {
        name: 'Agent Sarah',
        email: 'agent2@gmail.com',
        password: 'agent123',
        role: 'agent',
        phone: '+1234567893',
        department: 'Support',
        isActive: true,
      },
      {
        name: 'John Doe',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567894',
        department: 'Operations',
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@gmail.com',
        password: 'jane123',
        role: 'user',
        phone: '+1234567895',
        department: 'Marketing',
        isActive: true,
      },
      {
        name: 'Robert Wilson',
        email: 'robert@gmail.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567896',
        department: 'HR',
        isActive: true,
      },
      {
        name: 'Siva',
        email: 'siva1@gmail.com',
        password: '111111',
        role: 'user',
        phone: '+9876543210',
        department: 'Sales',
        isActive: true,
      },
    ]);

    console.log('✅ Users created:', users.length);

    // Create sample tickets
    const tickets = await Ticket.create([
      {
        title: 'Login Issue',
        description: 'Cannot login to my account. Getting error message "Invalid credentials"',
        category: 'account',
        priority: 'high',
        status: 'open',
        userId: users[4]._id,
        assignedTo: users[2]._id,
      },
      {
        title: 'Password Reset',
        description: 'Need to reset password. Forgot my current password.',
        category: 'security',
        priority: 'medium',
        status: 'in-progress',
        userId: users[5]._id,
        assignedTo: users[2]._id,
        notes: [
          {
            agentId: users[2]._id,
            content: 'Sent password reset link to user email',
          },
        ],
      },
      {
        title: 'Dashboard Not Loading',
        description: 'The dashboard page is blank and not loading properly.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        userId: users[4]._id,
        assignedTo: users[3]._id,
      },
      {
        title: 'Feature Request: Dark Mode',
        description: 'Would like to see a dark mode option in the application settings',
        category: 'feature-request',
        priority: 'low',
        status: 'open',
        userId: users[5]._id,
      },
      {
        title: 'Billing Query',
        description: 'Why was I charged twice for my subscription this month?',
        category: 'billing',
        priority: 'high',
        status: 'in-progress',
        userId: users[6]._id,
        assignedTo: users[2]._id,
      },
      {
        title: 'Export Report Bug',
        description: 'PDF export is not working. Error occurs when trying to export reports.',
        category: 'bug',
        priority: 'medium',
        status: 'on-hold',
        userId: users[4]._id,
      },
      {
        title: 'Account Hacked',
        description: 'Suspicious activity detected on my account. Please help secure it immediately.',
        category: 'security',
        priority: 'critical',
        status: 'in-progress',
        userId: users[5]._id,
        assignedTo: users[3]._id,
      },
      {
        title: 'Resolved: Profile Update',
        description: 'Needed to update my profile information',
        category: 'account',
        priority: 'low',
        status: 'closed',
        userId: users[6]._id,
        assignedTo: users[2]._id,
        resolution: 'User successfully updated profile. Issue resolved.',
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        rating: 5,
        feedback: 'Great support! Issue was resolved quickly.',
      },
    ]);

    console.log('✅ Tickets created:', tickets.length);
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
