import type { Request, Response } from 'express';
import * as orderService from '../services/orderService.js';

interface OrderItemInput {
  testKitId: string | number;
  qty: number;
  unitPriceCents: number;
}

interface CreateOrderBody {
  deliveryAddress: string;
  items: OrderItemInput[];
}

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is attached by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { deliveryAddress, items } = req.body as CreateOrderBody;

    // Validate required fields
    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.testKitId || !item.qty || item.qty < 1 || !item.unitPriceCents) {
        return res.status(400).json({ 
          error: 'Each item must have testKitId, qty (>= 1), and unitPriceCents' 
        });
      }
    }

    // Create the order with transaction
    const result = await orderService.createOrder({
      userId: BigInt(user.id),
      deliveryAddress: deliveryAddress.trim(),
      items: items.map(item => ({
        testKitId: BigInt(item.testKitId),
        qty: item.qty,
        unitPriceCents: item.unitPriceCents,
      })),
    });

    // Calculate total for response
    const totalCents = result.orderItems.reduce(
      (sum, item) => sum + item.unitPriceCents * item.qty, 
      0
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: result.order.id.toString(),
        status: result.order.status,
        deliveryAddress: result.order.deliveryAddress,
        createdAt: result.order.createdAt,
        items: result.orderItems.map(item => ({
          id: item.id.toString(),
          testKitId: item.testKitId.toString(),
          qty: item.qty,
          unitPriceCents: item.unitPriceCents,
        })),
        totalCents,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * Get all orders for the authenticated user
 * GET /api/orders
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is attached by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const orders = await orderService.getOrdersByUserId(BigInt(user.id));

    res.json({
      success: true,
      data: orders.map(order => ({
        id: order.id.toString(),
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id.toString(),
          testKitId: item.testKitId.toString(),
          testKitName: item.testKit.name,
          qty: item.qty,
          unitPriceCents: item.unitPriceCents,
        })),
        totalCents: order.items.reduce(
          (sum, item) => sum + item.unitPriceCents * item.qty, 
          0
        ),
      })),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * Get a specific order by ID
 * GET /api/orders/:id
 */
export const getOrder = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user is attached by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const orderId = req.params.id;
    if (!orderId || Array.isArray(orderId)) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await orderService.getOrderById(BigInt(orderId), BigInt(user.id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        id: order.id.toString(),
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id.toString(),
          testKitId: item.testKitId.toString(),
          testKitName: item.testKit.name,
          qty: item.qty,
          unitPriceCents: item.unitPriceCents,
        })),
        totalCents: order.items.reduce(
          (sum, item) => sum + item.unitPriceCents * item.qty, 
          0
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
