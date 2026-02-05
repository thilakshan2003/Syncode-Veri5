import express from 'express';
import { getStatus } from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * GET /api/dashboard/status/:userId
 * Get user status from User table
 */
router.get('/status/:userId', getStatus);

export default router;
