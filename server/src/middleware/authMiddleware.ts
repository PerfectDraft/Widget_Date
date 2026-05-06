import { Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedRequest } from '../types/index.js';

const googleClient = new OAuth2Client();

function verifyPhoneToken(token: string): { phone: string } | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { phone: string; sub?: string; iat?: number; exp?: number };
    if (decoded.phone) return { phone: decoded.phone };
    return null;
  } catch {
    return null;
  }
}

/** Strict auth — accepts JWT (phone auth) or Google OAuth token */
export const authGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Try JWT (phone auth) first
    const phoneUser = verifyPhoneToken(token);
    if (phoneUser) {
      req.user = { phone: phoneUser.phone };
      return next();
    }

    // Fallback to Google OAuth
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: token });
      const payload = ticket.getPayload();
      if (payload) {
        req.user = { googleId: payload.sub!, email: payload.email };
        return next();
      }
    } catch {
      const tokenInfo = await googleClient.getTokenInfo(token);
      if (tokenInfo && tokenInfo.sub) {
        req.user = { googleId: tokenInfo.sub, email: tokenInfo.email };
        return next();
      }
    }

    throw new Error('Invalid token type');
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Optional auth — tries JWT first, then Google token. Lets request
 * through regardless. Sets req.user if token is valid.
 */
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  // Try JWT first
  const phoneUser = verifyPhoneToken(token);
  if (phoneUser) {
    req.user = { phone: phoneUser.phone };
    return next();
  }

  // Fallback to Google OAuth
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();
    if (payload) {
      req.user = { googleId: payload.sub!, email: payload.email };
      return next();
    }
  } catch {
    try {
      const tokenInfo = await googleClient.getTokenInfo(token);
      if (tokenInfo && tokenInfo.sub) {
        req.user = { googleId: tokenInfo.sub, email: tokenInfo.email };
        return next();
      }
    } catch {
      // Token invalid or expired — silently continue as guest
    }
  }
  next();
};
