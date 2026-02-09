import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/schemas.js';
import Ticket from './models/Ticket.js';

dotenv.config();

const cleanup = async () => {
  try {
    await connectDB();
    console.log('🧹 Cleaning database...');
    
    await User.deleteMany({});
    await Ticket.deleteMany({});
    
    console.log('✅ All collections cleared');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

cleanup();
