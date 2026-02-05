import express from 'express';
import { getStatus, getTestCount } from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * GET /api/dashboard/status/:userId
 * Get user status from User table
 */
router.get('/status/:userId', getStatus);

/**
 * GET /api/dashboard/tests/:userId
 * Get number of tests taken by user
 */
router.get('/tests/:userId', getTestCount);

export default router;
