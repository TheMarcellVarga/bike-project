import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  images?: string[];
  specs?: Prisma.InputJsonValue;
}

// Create new product
router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('categoryId').notEmpty(),
    body('stock').isInt({ min: 0 }),
  ],
  async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await prisma.product.create({
        data: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          categoryId: req.body.categoryId,
          stock: req.body.stock,
          images: req.body.images || [],
          specs: req.body.specs || {},
        },
        include: {
          category: true,
        },
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

type UpdateProductInput = Prisma.ProductUpdateInput;

// Update product
router.put(
  '/:id',
  [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
  ],
  async (req: Request<{ id: string }, {}, Partial<UpdateProductInput>>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData: UpdateProductInput = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        images: req.body.images,
        specs: req.body.specs,
      };

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          category: true,
        },
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router; 