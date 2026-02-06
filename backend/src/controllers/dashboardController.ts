import type { Request, Response } from 'express';
import { 
  getUserStatus, 
  getUserTestCount, 
  getNextTestDate,
  createStatusShare,
  getReceivedStatusShares,
  viewStatusShare
} from '../services/dashboardService.js';

/**
 * Get user status from User table
 * GET /api/dashboard/status
 */
export const getStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const status = await getUserStatus(userId.toString());

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
 * GET /api/dashboard/tests
 */
export const getTestCount = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const testCount = await getUserTestCount(userId.toString());

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

/**
 * Get next test date (3 months after most recent test)
 * GET /api/dashboard/next-test
 */
export const getNextTest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const nextTestInfo = await getNextTestDate(userId.toString());

    if (!nextTestInfo) {
      return res.json({
        success: true,
        nextTestDate: null,
        message: 'No test history found'
      });
    }

    res.json({
      success: true,
      lastTestDate: nextTestInfo.lastTestDate,
      nextTestDate: nextTestInfo.nextTestDate
    });
  } catch (error: any) {
    console.error('Error in getNextTest controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch next test date'
    });
  }
};

/**
 * Create a new status share
 * POST /api/dashboard/status-share
 */
export const createShare = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { recipientUsername, expiryHours, maxViews } = req.body;

    const share = await createStatusShare(
      userId.toString(),
      recipientUsername,
      expiryHours || 24,
      maxViews || 1
    );

    res.json({
      success: true,
      data: share
    });
  } catch (error: any) {
    console.error('Error in createShare controller:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create status share'
    });
  }
};

/**
 * Get all received status shares
 * GET /api/dashboard/received-shares
 */
export const getReceivedShares = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const shares = await getReceivedStatusShares(userId.toString());

    res.json({
      success: true,
      data: shares
    });
  } catch (error: any) {
    console.error('Error in getReceivedShares controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch received status shares'
    });
  }
};

/**
 * View a status share by token
 * GET /api/dashboard/view-share/:token
 */
export const viewShare = async (req: Request, res: Response) => {
  try {
    const rawToken = req.params.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const statusData = await viewStatusShare(token);

    res.json({
      success: true,
      data: statusData
    });
  } catch (error: any) {
    console.error('Error in viewShare controller:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to view status share'
    });
  }
};
