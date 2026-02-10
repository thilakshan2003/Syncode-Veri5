import { prisma } from '../config/db.js';
import crypto from 'crypto';

/**
 * Get user status from User table
 * Query: SELECT status FROM User WHERE id = userId
 */
export const getUserStatus = async (userId: string) => {
  try {
    const user = await prisma.users.findUnique({
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
    const count = await prisma.user_verifications.count({
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
    const mostRecentTest = await prisma.user_verifications.findFirst({
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
 * @param expiryHours - Number of hours until the link expires (default 5 minutes = 0.0833 hours)
 * @param maxViews - Maximum number of views allowed (default 1)
 */
export const createStatusShare = async (
  senderUserId: string,
  recipientUsername?: string,
  expiryHours: number = 0.0833, // Default: 5 minutes (matches frontend default)
  maxViews: number = 1
) => {
  const senderBigIntId = BigInt(senderUserId);

  // If recipient username is provided, find the recipient user
  let recipientUserId: bigint | null = null;
  if (recipientUsername) {
    const recipient = await prisma.users.findUnique({
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

  // Calculate expiry date - FIX: Use milliseconds instead of setHours for accurate calculation
  const expiresAt = new Date();
  const expiryMilliseconds = expiryHours * 60 * 60 * 1000; // Convert hours to milliseconds
  expiresAt.setTime(expiresAt.getTime() + expiryMilliseconds);

  // Create status share record
  const statusShare = await prisma.status_shares.create({
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

  const shares = await prisma.status_shares.findMany({
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

  const statusShare = await prisma.status_shares.findUnique({
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

  console.log('Viewing status share with token:', token);
  console.log('Found status share:', statusShare);


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
  await prisma.status_shares.update({
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

/**
 * Get user appointments
 * Query: SELECT appointments with practitioner and clinic details
 */
export const getUserAppointments = async (userId: string) => {
  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        userId: BigInt(userId)
      },
      include: {
        slot: {
          include: {
            practitioner: {
              include: {
                user: {
                  select: {
                    username: true
                  }
                }
              }
            },
            clinic: {
              select: {
                name: true,
                address: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Get most recent 10 appointments
    });

    // Format appointments for frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id.toString(),
      status: appointment.status,
      practitionerName: appointment.slot?.practitioner?.user?.username || 'Unknown',
      specialization: appointment.slot?.practitioner?.specialization || '',
      clinicName: appointment.slot?.clinic?.name || 'Not specified',
      clinicAddress: appointment.slot?.clinic?.address || '',
      mode: appointment.slot?.mode || 'physical',
      appointmentDate: appointment.slot?.startsAt || null,
      appointmentEndTime: appointment.slot?.endsAt || null,
      priceCents: appointment.slot?.priceCents || 0,
      createdAt: appointment.createdAt
    }));

    return formattedAppointments;
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    throw error;
  }
};

/**
 * Get comprehensive activity log for user
 * Includes: appointments, tests, status shares, status updates, and orders
 */
export const getUserActivityLog = async (userId: string, limit: number = 20) => {
  try {
    const userBigIntId = BigInt(userId);
    const activities: any[] = [];

    // Fetch recent appointments
    const appointments = await prisma.appointments.findMany({
      where: { userId: userBigIntId },
      include: {
        slot: {
          include: {
            practitioner: true,
            clinic: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    appointments.forEach(apt => {
      activities.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: `Appointment with ${apt.slot.practitioner.name}`,
        description: apt.slot.clinic?.name || 'Online consultation',
        status: apt.status,
        timestamp: apt.createdAt,
        metadata: {
          practitionerName: apt.slot.practitioner.name,
          clinicName: apt.slot.clinic?.name,
          mode: apt.slot.mode,
          appointmentDate: apt.slot.startsAt
        }
      });
    });

    // Fetch recent test verifications
    const verifications = await prisma.user_verifications.findMany({
      where: { userId: userBigIntId },
      include: {
        testKit: { select: { name: true } },
        clinic: { select: { name: true } },
        verifiedByUser: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    verifications.forEach(ver => {
      activities.push({
        id: `ver-${ver.id}`,
        type: 'verification',
        title: `${ver.testKit.name} Test ${ver.status === 'verified' ? 'Verified' : 'Recorded'}`,
        description: ver.clinic?.name || 'Test verification',
        status: ver.status,
        timestamp: ver.verifiedAt || ver.createdAt,
        metadata: {
          testType: ver.testKit.name,
          clinicName: ver.clinic?.name,
          verifiedBy: ver.verifiedByUser?.username,
          testedAt: ver.testedAt
        }
      });
    });

    // Fetch recent status shares (sent by user)
    const statusSharesSent = await prisma.status_shares.findMany({
      where: { senderUserId: userBigIntId },
      include: {
        recipient: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    statusSharesSent.forEach(share => {
      activities.push({
        id: `share-sent-${share.id}`,
        type: 'status_share_sent',
        title: `Shared status with ${share.recipient?.username || share.recipientUsernameSnapshot || 'someone'}`,
        description: `Link expires: ${share.expiresAt.toLocaleString()}`,
        status: share.revokedAt ? 'revoked' : share.viewedAt ? 'viewed' : 'active',
        timestamp: share.createdAt,
        metadata: {
          recipientUsername: share.recipient?.username || share.recipientUsernameSnapshot,
          viewCount: share.viewCount,
          maxViews: share.maxViews,
          expiresAt: share.expiresAt,
          viewedAt: share.viewedAt
        }
      });
    });

    // Fetch recent status shares (received by user)
    const statusSharesReceived = await prisma.status_shares.findMany({
      where: { recipientUserId: userBigIntId },
      include: {
        sender: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    statusSharesReceived.forEach(share => {
      activities.push({
        id: `share-received-${share.id}`,
        type: 'status_share_received',
        title: `Received status from ${share.sender.username}`,
        description: share.viewedAt ? `Viewed at: ${share.viewedAt.toLocaleString()}` : 'Not viewed yet',
        status: share.viewedAt ? 'viewed' : 'pending',
        timestamp: share.createdAt,
        metadata: {
          senderUsername: share.sender.username,
          viewedAt: share.viewedAt,
          expiresAt: share.expiresAt
        }
      });
    });

    // Fetch recent orders
    const orders = await prisma.orders.findMany({
      where: { userId: userBigIntId },
      include: {
        items: {
          include: {
            testKit: {
              select: {
                name: true,
                priceCents: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    orders.forEach(order => {
      const itemNames = order.items.map(item => item.testKit.name).join(', ');
      const totalAmount = order.items.reduce((sum, item) => sum + (item.unitPriceCents * item.qty), 0);

      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Ordered Test Kit${order.items.length > 1 ? 's' : ''}`,
        description: itemNames || 'Test kit order',
        status: order.status,
        timestamp: order.createdAt,
        metadata: {
          orderNumber: order.id.toString(),
          itemCount: order.items.length,
          totalAmount: totalAmount,
          items: order.items.map(item => ({
            testKitName: item.testKit.name,
            quantity: item.qty,
            unitPrice: item.unitPriceCents
          }))
        }
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit results
    const limitedActivities = activities.slice(0, limit);

    // Format timestamps for frontend
    const formattedActivities = limitedActivities.map(activity => ({
      ...activity,
      id: activity.id,
      timestamp: activity.timestamp.toISOString(),
      timeAgo: getTimeAgo(activity.timestamp)
    }));

    return formattedActivities;
  } catch (error) {
    console.error('Error fetching user activity log:', error);
    throw error;
  }
};

/**
 * Helper function to calculate time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}