import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute
  message: { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Quá nhiều yêu cầu AI. Vui lòng đợi 1 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
