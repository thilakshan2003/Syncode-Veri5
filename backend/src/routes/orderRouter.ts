import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// POST /api/orders - Create a new order
router.post('/', createOrder);

// GET /api/orders - Get all orders for the user
router.get('/', getOrders);

// GET /api/orders/:id - Get a specific order
router.get('/:id', getOrder);

export default router;
