import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from '../types/index.js';

export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  console.error(`[ERROR] ${err.message}`);

  // Don't leak stack traces to client
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
