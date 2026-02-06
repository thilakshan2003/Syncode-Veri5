import express from 'express';
import { 
  getStatus, 
  getTestCount, 
  getNextTest,
  createShare,
  getReceivedShares,
  viewShare
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/dashboard/view-share/:token
 * View a status share by token (public, no authentication required)
 * This must be BEFORE authenticate middleware
 */
router.get('/view-share/:token', viewShare);

// Apply authentication middleware to all other dashboard routes
router.use(authenticate);

/**
 * GET /api/dashboard/status
 * Get user status from User table (uses authenticated user)
 */
router.get('/status', getStatus);

/**
 * GET /api/dashboard/tests
 * Get number of tests taken by user (uses authenticated user)
 */
router.get('/tests', getTestCount);

/**
 * GET /api/dashboard/next-test
 * Get next test date (3 months after most recent test) (uses authenticated user)
 */
router.get('/next-test', getNextTest);

/**
 * POST /api/dashboard/status-share
 * Create a new status share (requires authentication)
 */
router.post('/status-share', createShare);

/**
 * GET /api/dashboard/received-shares
 * Get all received status shares (requires authentication)
 */
router.get('/received-shares', getReceivedShares);

export default router;
