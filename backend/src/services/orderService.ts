import { prisma } from '../config/db.js';
import { OrderStatus } from '../../generated/prisma/enums.js';

interface CreateOrderData {
  userId: bigint;
  deliveryAddress: string;
  items: {
    testKitId: bigint;
    qty: number;
    unitPriceCents: number;
  }[];
}

/**
 * Create a new order with order items in a transaction
 * This ensures both the order and order items are created atomically
 */
export const createOrder = async (data: CreateOrderData) => {
  // Use a transaction to ensure both order and order items are created together
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        deliveryAddress: data.deliveryAddress,
        status: OrderStatus.created, // Cash on delivery starts as 'created'
      },
    });

    // 2. Create the order items
    const orderItems = await Promise.all(
      data.items.map((item) =>
        tx.orderItem.create({
          data: {
            orderId: order.id,
            testKitId: item.testKitId,
            qty: item.qty,
            unitPriceCents: item.unitPriceCents,
          },
        })
      )
    );

    // 3. Return the complete order with items
    return {
      order,
      orderItems,
    };
  });

  return result;
};

/**
 * Get orders for a specific user
 */
export const getOrdersByUserId = async (userId: bigint) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          testKit: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Get a specific order by ID
 */
export const getOrderById = async (orderId: bigint, userId: bigint) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId, // Ensure user can only access their own orders
    },
    include: {
      items: {
        include: {
          testKit: true,
        },
      },
    },
  });
};
