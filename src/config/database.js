import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://luisgb23:Lulusico023@cluster0.v3udvih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 