import mongoose from 'mongoose';
import { envConfig } from './env.config';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB successfully connected.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost. Attempting reconnect...');
    });

    await mongoose.connect(envConfig.mongodbUri);
  } catch (error) {
    console.error('Initial MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
