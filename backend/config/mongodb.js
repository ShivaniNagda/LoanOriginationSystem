import mongoose from 'mongoose';

// MongoDB Connection
const dburl = 'mongodb://127.0.0.1:27017/loan-origination';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || dburl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;


