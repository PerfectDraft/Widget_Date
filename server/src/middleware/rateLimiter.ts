import rateLimit from 'express-rate-limit';
import type { AuthenticatedRequest } from '../types/index.js';

// Guest limiter (3 per hour per IP)
export const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { error: 'Guest limit exceeded. Please login to get more AI uses.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Verified User limiter (20 per hour per googleId)
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Your hourly AI limit (20) has been exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as AuthenticatedRequest).user?.googleId || req.ip || 'unknown';
  }
});
