import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1); // Exit process on failure
  }
}
