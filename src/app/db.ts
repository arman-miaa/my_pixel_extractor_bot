import mongoose from 'mongoose';
import config from './config';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(config.database_url);
    isConnected = true;
    console.log('🛢️  Database connected successfully!');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed:', err);
  }
};
