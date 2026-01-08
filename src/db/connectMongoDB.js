import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MongoDB URI is missing');
  }

  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};
