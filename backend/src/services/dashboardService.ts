import { prisma } from '../config/db.js';

/**
 * Get user status from User table
 * Query: SELECT status FROM User WHERE id = userId
 */
export const getUserStatus = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(userId)
      },
      select: {
        status: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Return only the status value
    return user.status; // "Verified" or "Not_Verified"
  } catch (error) {
    console.error('Error fetching user status:', error);
    throw error;
  }
};
