import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

interface LoginUserBody {
  email: string;
  password: string;
}

// Register new user
router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request<{}, {}, LoginUserBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // TODO: Generate and return JWT token
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
);

// Get user profile
router.get(
  '/profile/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
);

// Update user profile
router.put(
  '/profile/:id',
  [
    body('name').optional().trim(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  async (req: Request<{ id: string }, {}, Partial<RegisterUserBody>>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData: any = { ...req.body };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }
);

export default router; 