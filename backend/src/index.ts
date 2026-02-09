import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clinicRouter from './routes/clinicRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import practitionerRouter from './routes/practitionerRouter.js';
import testKitRouter from './routes/testKitRouter.js';
import orderRouter from './routes/orderRouter.js';
import resourceRoutes from './routes/resourceRoutes.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { serializeBigInt } from './utils/serialization.js';
import fs from 'fs';

const log = (msg: string) => fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - ${msg}\n`);
log('Index.ts loading...');

dotenv.config();

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const app = express();
// Force restart
const PORT = process.env.PORT || 5000;

app.use(cors({
    //This is the frontend URL 
    // Used to set the Access-Control-Allow-Origin CORS header
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Custom JSON serializer for BigInt
app.set('json replacer', (key: string, value: any) => {
    return typeof value === 'bigint' ? value.toString() : value;
});

// Mount auth routes
log('Mounting auth routes at /api/auth');
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRouter);
app.use('/practitioners', practitionerRouter);
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.use('/clinics', clinicRouter);
app.use('/test-kits', testKitRouter);
app.use('/api/orders', orderRouter);
app.use('/api/resources', resourceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});