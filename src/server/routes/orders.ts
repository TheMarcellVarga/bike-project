import express, { Request, Response } from 'express';
import { PrismaClient, Prisma, OrderStatus } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderBody {
  userId: string;
  items: OrderItemInput[];
  totalAmount: number;
}

// Get all orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post(
  '/',
  [
    body('userId').notEmpty(),
    body('items').isArray(),
    body('items.*.productId').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.price').isFloat({ min: 0 }),
    body('totalAmount').isFloat({ min: 0 }),
  ],
  async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await prisma.order.create({
        data: {
          userId: req.body.userId,
          totalAmount: req.body.totalAmount,
          items: {
            create: req.body.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

interface UpdateOrderStatusBody {
  status: OrderStatus;
}

// Update order status
router.patch(
  '/:id/status',
  [body('status').isIn(Object.values(OrderStatus))],
  async (req: Request<{ id: string }, {}, UpdateOrderStatusBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

// Delete order
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    await prisma.order.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router; 