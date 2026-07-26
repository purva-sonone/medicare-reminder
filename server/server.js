import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// API Base Route Test
app.get('/api/health', (req, res) => {
    res.json({ message: 'MediCare Reminder API is running smoothly.' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
