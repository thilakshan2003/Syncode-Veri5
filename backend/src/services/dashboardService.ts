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

/**
 * Get number of tests taken by user from UserVerification table
 * Query: SELECT COUNT(*) FROM user_verifications WHERE userId = userId
 */
export const getUserTestCount = async (userId: string) => {
  try {
    const count = await prisma.userVerification.count({
      where: {
        userId: BigInt(userId)
      }
    });

    // If no rows found, return 0
    return count;
  } catch (error) {
    console.error('Error fetching user test count:', error);
    throw error;
  }
};