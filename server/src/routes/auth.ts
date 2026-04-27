import { Router } from 'express';
import { userService } from '../services/userService.js';

const router = Router();

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
    res.json({ success: true, message: 'Registration successful' });
  } catch (err: any) {
    console.error('Registration error:', err);
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

    // Success - return user info (excluding password hash)
    const { password_hash, ...profile } = user;
    res.json({ success: true, user: profile });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const authRouter = router;
