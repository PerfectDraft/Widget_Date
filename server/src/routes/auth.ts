import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userService } from '../services/userService.js';

const router = Router();

function generateToken(phone: string): string {
  return jwt.sign({ phone, sub: phone }, env.JWT_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register', async (req, res) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
    const existing = userService.getUser(phone);
    if (existing && existing.password_hash) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if (existing) {
       // User exists (maybe from an old sync without password), let's update password
       // For safety, we should probably check something else, but here we just update
    }

    await userService.createUser(phone, password);
    const token = generateToken(phone);
    res.json({ success: true, message: 'Registration successful', token });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
    const user = await userService.verifyUser(phone, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    const token = generateToken(phone);
    const { password_hash, ...profile } = user;
    res.json({ success: true, user: profile, token });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const authRouter = router;
