import type { Request } from 'express';

/** Authenticated user info attached by auth middleware */
export interface AuthUser {
  googleId: string;
  email?: string;
}

/** Express Request extended with optional authenticated user */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/** Error with HTTP status code for the error handler */
export interface HttpError extends Error {
  status?: number;
}
