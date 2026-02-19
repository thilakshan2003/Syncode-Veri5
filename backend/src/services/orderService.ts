import { prisma } from '../config/db.js';
import { OrderStatus } from '../../generated/prisma/enums.js';
import { randomUUID } from 'crypto';

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
 * Create a new order with order items and test kit instances in a transaction
 * This ensures order, order items, and test kit instances are created atomically
 */
export const createOrder = async (data: CreateOrderData) => {
  // Use a transaction to ensure everything is created together
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.orders.create({
      data: {
        userId: data.userId,
        deliveryAddress: data.deliveryAddress,
        status: OrderStatus.created, // Cash on delivery starts as 'created'
      },
    });

    // 2. Create the order items
    const orderItems = await Promise.all(
      data.items.map((item) =>
        tx.order_items.create({
          data: {
            orderId: order.id,
            testKitId: item.testKitId,
            qty: item.qty,
            unitPriceCents: item.unitPriceCents,
          },
        })
      )
    );

    // 3. Create test kit instances for each ordered quantity
    // Each test kit gets a unique serial number for validation during test result upload
    const testKitInstances: any[] = [];
    for (const item of data.items) {
      for (let i = 0; i < item.qty; i++) {
  // Generate unique serial number using VERI5-XX-YYYY format
  const part1 = Math.floor(Math.random() * 90 + 10); // 2 digits
  const part2 = Math.floor(Math.random() * 9000 + 1000); // 4 digits
  const serialNumber = `VERI5-${part1}-${part2}`;
        testKitInstances.push({
          serial_number: serialNumber,
          test_kit_id: item.testKitId,
          order_id: order.id,
          user_id: data.userId,
          // used_at and verified_at are null by default
          // These will be set when user uploads test results
        });
      }
    }

    // Bulk insert test kit instances
    if (testKitInstances.length > 0) {
      await tx.test_kit_instances.createMany({
        data: testKitInstances,
      });
    }

    // 4. Return the complete order with items and created instances count
    return {
      order,
      orderItems,
      testKitInstancesCreated: testKitInstances.length,
    };
  });

  return result;
};

/**
 * Get orders for a specific user
 */
export const getOrdersByUserId = async (userId: bigint) => {
  return prisma.orders.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          testKit: true,
        },
      },
      test_kit_instances: {
        select: {
          id: true,
          serial_number: true,
          test_kit_id: true,
          used_at: true,
          verified_at: true,
          created_at: true,
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
  return prisma.orders.findFirst({
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
      test_kit_instances: {
        select: {
          id: true,
          serial_number: true,
          test_kit_id: true,
          used_at: true,
          verified_at: true,
          created_at: true,
        },
      },
    },
  });
};
