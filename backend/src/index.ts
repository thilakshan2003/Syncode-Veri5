import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { serializeBigInt } from './utils/serialization.js';
import fs from 'fs';

const log = (msg: string) => fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - ${msg}\n`);
log('Index.ts loading...');

dotenv.config();

const app = express();
// Force restart
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Custom JSON serializer for BigInt
app.set('json replacer', (key: string, value: any) => {
    return typeof value === 'bigint' ? value.toString() : value;
});

log('Mounting auth routes at /api/auth');
app.use('/api/auth', authRoutes);

// basic health endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
