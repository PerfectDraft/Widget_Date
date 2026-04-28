import { Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import type { AuthenticatedRequest } from '../types/index.js';

const client = new OAuth2Client();

/** Strict auth — rejects unauthenticated requests with 401 */
export const authGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const ticket = await client.verifyIdToken({ idToken: token });
      const payload = ticket.getPayload();
      if (payload) {
        req.user = { googleId: payload.sub!, email: payload.email };
        return next();
      }
    } catch (idErr) {
      const tokenInfo = await client.getTokenInfo(token);
      if (tokenInfo && tokenInfo.sub) {
        req.user = { googleId: tokenInfo.sub, email: tokenInfo.email };
        return next();
      }
      throw new Error('Invalid token type');
    }
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid Google token' });
  }
};

/**
 * Optional auth — tries to verify Google token, but lets the request
 * through regardless. Sets req.user if token is valid, otherwise req.user
 * is undefined. Used for AI routes that should work for everyone.
 */
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token → proceed as guest
  }

  const token = authHeader.split(' ')[1];
  try {
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();
    if (payload) {
      req.user = { googleId: payload.sub!, email: payload.email };
      return next();
    }
  } catch {
    try {
      const tokenInfo = await client.getTokenInfo(token);
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
