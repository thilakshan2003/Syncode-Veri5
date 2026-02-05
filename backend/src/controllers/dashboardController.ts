import type { Request, Response } from 'express';
import { getUserStatus } from '../services/dashboardService.js';

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

