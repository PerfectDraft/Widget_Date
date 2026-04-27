import { Router } from 'express';
import { fetchNearbyPlaces, generateCombos, chatWithAI } from '../services/geminiService.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { aiLimiter, guestLimiter } from '../middleware/rateLimiter.js';

export const geminiRouter = Router();

// POST /api/nearby-places
geminiRouter.post('/nearby-places', authGuard, aiLimiter, async (req, res, next) => {
  try {
    const { location } = req.body;
    if (!location || typeof location !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "location" field.' });
      return;
    }

    const result = await fetchNearbyPlaces(location);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/combos
geminiRouter.post('/combos', authGuard, aiLimiter, async (req, res, next) => {
  try {
    const { location, budget, companion, startTime, endTime, preferences, availablePlaces } = req.body;

    if (!location || !budget || !companion || !startTime || !endTime) {
      res.status(400).json({ error: 'Missing required fields: location, budget, companion, startTime, endTime.' });
      return;
    }

    const combos = await generateCombos({
      location,
      budget,
      companion,
      startTime,
      endTime,
      preferences: preferences || [],
      availablePlaces,
    });

    res.json(combos);
  } catch (err) {
    next(err);
  }
});

// POST /api/chat
geminiRouter.post('/chat', authGuard, aiLimiter, async (req, res, next) => {
  try {
    const { history, message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "message" field.' });
      return;
    }

    const reply = await chatWithAI(history || [], message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});
