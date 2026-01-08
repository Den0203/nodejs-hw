import mongoose from 'mongoose';

export async function connectMongoDB() {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error('MongoDB URI is missing');
  }

  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected');
}
