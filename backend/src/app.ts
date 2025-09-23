import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

configDotenv()

const app = express();
const PORT = process.env.PORT || 8000;

import connectDB from './config/db';

// Routes
import authRoutes from './routes/auth.routes'
import { errorHandler } from './midddlewares/error-handler.middleware';


// Connect to the database
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes)


app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});