/**
 * Auth Middleware
 * 
 * Placeholder for authentication middleware.
 * Replace with your actual auth implementation.
 * 
 * Expected behavior:
 * - Verify JWT token or session
 * - Extract userId from token
 * - Attach userId to request object as BigInt
 * - Call next() if authenticated
 * - Return 401 if not authenticated
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Authenticate user and attach userId to request
 * 
 * IMPORTANT: Replace this with your actual auth logic
 * 
 * Current implementation: PLACEHOLDER ONLY
 */
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // TODO: Replace with actual auth logic
    // Example implementations:
    
    // JWT approach:
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) {
    //   res.status(401).json({ error: 'No token provided' });
    //   return;
    // }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // (req as any).userId = BigInt(decoded.userId);
    
    // Session approach:
    // if (!req.session?.userId) {
    //   res.status(401).json({ error: 'Not authenticated' });
    //   return;
    // }
    // (req as any).userId = BigInt(req.session.userId);

    // TEMPORARY: For testing only - remove in production
    // Assumes userId passed as header
    const userIdHeader = req.headers['x-user-id'] as string;
    if (userIdHeader) {
      (req as any).userId = BigInt(userIdHeader);
      next();
      return;
    }

    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid authentication',
    });
  }
};

/**
 * Optional: Middleware to validate user exists in database
 */
export const validateUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId as bigint;
    
    // Import prisma and check if user exists
    // const { prisma } = await import('../service/db.js');
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { id: true },
    // });
    
    // if (!user) {
    //   res.status(404).json({
    //     success: false,
    //     error: 'Not Found',
    //     message: 'User not found',
    //   });
    //   return;
    // }

    next();
  } catch (error) {
    console.error('User validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
