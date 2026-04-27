import { Router } from 'express';
import { userService } from '../services/userService.js';

export const userRouter = Router();

// Middleware to extract phone from header or body if needed
// For now, we'll expect phone in the body for POST and query for GET
// In a real app, this should be verified via OTP or Token

userRouter.post('/user/sync', (req, res) => {
  const { phone, googleId, preferences, lastTab } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    userService.upsertUser(phone, googleId, preferences, lastTab);
    userService.logAction(phone, 'sync_data', { lastTab });
    res.json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.get('/user/profile', (req, res) => {
  const phone = req.query.phone as string;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const user = userService.getUser(phone);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const savedPlaces = userService.getSavedPlaces(phone);
    res.json({ ...user, savedPlaces });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.post('/user/place', (req, res) => {
  const { phone, placeId, placeData } = req.body;
  if (!phone || !placeId || !placeData) {
    return res.status(400).json({ error: 'Missing phone, placeId, or placeData' });
  }

  try {
    userService.savePlace(phone, placeId, placeData);
    userService.logAction(phone, 'save_place', { placeId, title: placeData.title });
    res.json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
