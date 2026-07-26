import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Retry after 5 seconds
    console.log('⏳ Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
