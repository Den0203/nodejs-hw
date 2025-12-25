import mongoose from 'mongoose';

export async function connectMongoDB() {
  const { MONGO_URL } = process.env;

  if (!MONGO_URL) {
    console.error('❌ MONGO_URL is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}
