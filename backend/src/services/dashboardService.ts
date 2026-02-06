import { prisma } from '../config/db.js';
import crypto from 'crypto';

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

/**
 * Get the next test date (3 months after most recent test)
 * Query: SELECT MAX(testedAt) FROM user_verifications WHERE userId = userId
 */
export const getNextTestDate = async (userId: string) => {
  try {
    // Get the most recent test date
    const mostRecentTest = await prisma.userVerification.findFirst({
      where: {
        userId: BigInt(userId),
        testedAt: {
          not: null
        }
      },
      orderBy: {
        testedAt: 'desc'
      },
      select: {
        testedAt: true
      }
    });

    // If no tests found, return null
    if (!mostRecentTest || !mostRecentTest.testedAt) {
      return null;
    }

    // Calculate next test date (3 months = 90 days after most recent test)
    const lastTestDate = new Date(mostRecentTest.testedAt);
    const nextTestDate = new Date(lastTestDate);
    nextTestDate.setDate(nextTestDate.getDate() + 90); // Add 90 days

    return {
      lastTestDate: lastTestDate,
      nextTestDate: nextTestDate
    };
  } catch (error) {
    console.error('Error fetching next test date:', error);
    throw error;
  }
};

/**
 * Create a status share
 * @param senderUserId - User ID of the sender
 * @param recipientUsername - Username of the recipient (optional)
 * @param expiryHours - Number of hours until the link expires (default 24)
 * @param maxViews - Maximum number of views allowed (default 1)
 */
export const createStatusShare = async (
  senderUserId: string,
  recipientUsername?: string,
  expiryHours: number = 24,
  maxViews: number = 1
) => {
  const senderBigIntId = BigInt(senderUserId);

  // If recipient username is provided, find the recipient user
  let recipientUserId: bigint | null = null;
  if (recipientUsername) {
    const recipient = await prisma.user.findUnique({
      where: { username: recipientUsername },
      select: { id: true }
    });

    if (!recipient) {
      throw new Error('Recipient user not found');
    }

    recipientUserId = recipient.id;
  }

  // Generate a unique token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);

  // Create status share record
  const statusShare = await prisma.statusShare.create({
    data: {
      senderUserId: senderBigIntId,
      recipientUserId: recipientUserId,
      recipientUsernameSnapshot: recipientUsername || null,
      tokenHash,
      expiresAt,
      maxViews
    }
  });

  return {
    id: statusShare.id.toString(),
    token, // Return the plain token (not the hash)
    expiresAt: statusShare.expiresAt,
    recipientUsername: recipientUsername || null
  };
};

/**
 * Get all received status shares for a user
 * @param userId - User ID
 */
export const getReceivedStatusShares = async (userId: string) => {
  const bigIntId = BigInt(userId);

  const shares = await prisma.statusShare.findMany({
    where: {
      recipientUserId: bigIntId,
      revokedAt: null
    },
    include: {
      sender: {
        select: {
          username: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return shares.map(share => ({
    id: share.id.toString(),
    senderUsername: share.sender.username,
    senderStatus: share.sender.status,
    createdAt: share.createdAt,
    expiresAt: share.expiresAt,
    viewedAt: share.viewedAt,
    isExpired: share.expiresAt < new Date(),
    isViewed: share.viewedAt !== null
  }));
};

/**
 * View a status share by token
 * @param token - Status share token
 */
export const viewStatusShare = async (token: string) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const statusShare = await prisma.statusShare.findUnique({
    where: { tokenHash },
    include: {
      sender: {
        select: {
          username: true,
          status: true,
          updatedAt: true
        }
      }
    }
  });

  if (!statusShare) {
    throw new Error('Status share not found');
  }

  // Check if revoked
  if (statusShare.revokedAt) {
    throw new Error('This status share has been revoked');
  }

  // Check if expired
  if (statusShare.expiresAt < new Date()) {
    throw new Error('This status share has expired');
  }

  // Check if max views reached
  if (statusShare.viewCount >= statusShare.maxViews) {
    throw new Error('This status share has reached its maximum view limit');
  }

  // Update view count and viewed at timestamp
  await prisma.statusShare.update({
    where: { id: statusShare.id },
    data: {
      viewCount: { increment: 1 },
      viewedAt: statusShare.viewedAt || new Date() // Only set on first view
    }
  });

  return {
    senderUsername: statusShare.sender.username,
    senderStatus: statusShare.sender.status,
    lastUpdated: statusShare.sender.updatedAt,
    viewCount: statusShare.viewCount + 1,
    maxViews: statusShare.maxViews
  };
};
