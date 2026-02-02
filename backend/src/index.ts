import express, { type Request, type Response } from 'express';
import cors from 'cors';
import clinicRouter from './routers/clinicRouter.js';
import dotenv from 'dotenv';

dotenv.config();

// Fix BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// basic health endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.use('/clinics', clinicRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
