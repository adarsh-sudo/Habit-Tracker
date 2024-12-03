import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import habitsRoutes from './routes/habits';
import habitLogsRoutes from './routes/habitLogs';
import remindersRoutes from './routes/reminders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Database
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/habits', habitsRoutes);
app.use('/habit-logs', habitLogsRoutes);
app.use('/reminders', remindersRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
