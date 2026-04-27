import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { geminiRouter } from './routes/gemini.js';
import { scraperRouter } from './routes/scraper.js';
import { weatherRouter } from './routes/weather.js';
import { userRouter } from './routes/user.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSchema } from './db/client.js';

// Init DB
initSchema();

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', geminiRouter);
app.use('/api', scraperRouter);
app.use('/api', weatherRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Widget Date Server running on http://localhost:${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/api/health`);
  console.log(`   CORS origin: ${env.CLIENT_ORIGIN}`);
});
