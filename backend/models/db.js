import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ibm_helpdesk';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Handle errors
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default mongoose;
