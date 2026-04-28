import { Router, Response, NextFunction } from 'express';
import { fetchNearbyPlaces, generateCombos, chatWithAI } from '../services/geminiService.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { aiLimiter, guestLimiter } from '../middleware/rateLimiter.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const geminiRouter = Router();

/**
 * Dual-track rate limiter: authenticated users get aiLimiter (20/hr),
 * guests get guestLimiter (3/hr). No 401 for missing/expired tokens.
 */
const dualLimiter = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    return aiLimiter(req, res, next);
  }
  return guestLimiter(req, res, next);
};

// POST /api/nearby-places
geminiRouter.post('/nearby-places', optionalAuth, dualLimiter, async (req, res, next) => {
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
geminiRouter.post('/combos', optionalAuth, dualLimiter, async (req, res, next) => {
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
geminiRouter.post('/chat', optionalAuth, dualLimiter, async (req, res, next) => {
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
