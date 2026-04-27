import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // First try as ID token
      const ticket = await client.verifyIdToken({ idToken: token });
      const payload = ticket.getPayload();
      if (payload) {
        (req as any).user = { googleId: payload.sub, email: payload.email };
        return next();
      }
    } catch (idErr) {
      // If it fails, assume it's an access_token (which was saved by useGoogleLogin in Phase 1)
      const tokenInfo = await client.getTokenInfo(token);
      if (tokenInfo && tokenInfo.sub) {
        (req as any).user = { googleId: tokenInfo.sub, email: tokenInfo.email };
        return next();
      }
      throw new Error('Invalid token type');
    }
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid Google token' });
  }
};
