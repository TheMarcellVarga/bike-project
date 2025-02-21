const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

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

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

// Register new user
router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: any, res: any) => {
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

      const token = generateToken(user.id);

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
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
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (!user) {
        console.log('User not found:', req.body.email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        console.log('Invalid password for user:', req.body.email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.json({
        user: userData,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
});

// Update user profile
router.put(
  '/me',
  auth,
  [
    body('name').optional().trim(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  async (req: any, res: any) => {
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
        where: { id: req.user.id },
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

// Logout user (optional - client-side token removal)
router.post('/logout', auth, (_req: any, res: any) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 