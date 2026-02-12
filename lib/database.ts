import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

let cachedConnection: typeof mongoose | null = null;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    cachedConnection = conn;
    console.log('MongoDB connection established');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};