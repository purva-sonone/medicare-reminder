import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Attempting to connect to MongoDB with URI:');
console.log(process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

const testConn = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS! MongoDB Connected to host:', conn.connection.host);
        process.exit(0);
    } catch (error) {
        console.error('CONNECTION ERROR TYPE:', error.name);
        console.error('ERROR MESSAGE:', error.message);
        if (error.reason) {
            console.error('ERROR REASON DETAILS:', error.reason);
        }
        process.exit(1);
    }
};

testConn();
