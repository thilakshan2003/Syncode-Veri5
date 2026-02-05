import type { Request, Response } from 'express';
import { getUserStatus, getUserTestCount } from '../services/dashboardService.js';

/**
 * Get user status from User table
 * GET /api/dashboard/status/:userId
 */
export const getStatus = async (req: Request, res: Response) => {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const status = await getUserStatus(userId);

    res.json({
      success: true,
      status: status // Just return "Verified" or "Not_Verified"
    });
  } catch (error: any) {
    console.error('Error in getStatus controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user status'
    });
  }
};

/**
 * Get number of tests taken by user
 * GET /api/dashboard/tests/:userId
 */
export const getTestCount = async (req: Request, res: Response) => {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const testCount = await getUserTestCount(userId);

    res.json({
      success: true,
      testCount: testCount // Number of tests (0 if no rows)
    });
  } catch (error: any) {
    console.error('Error in getTestCount controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch test count'
    });
  }
};

