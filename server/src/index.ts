import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { geminiRouter } from './routes/gemini.js';
import { scraperRouter } from './routes/scraper.js';
import { weatherRouter } from './routes/weather.js';
import { userRouter } from './routes/user.js';
import { authRouter } from './routes/auth.js';
import { trendsRouter } from './routes/trends.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSchema } from './db/client.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/trends', trendsRouter);

// Serve static frontend
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Log the resolved path for debugging B6
console.log(`📂 Static files path: ${clientDistPath}`);

app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // If it's an API route that wasn't caught by the routers above, let it fall through to 404 handler
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Failed to serve index.html: ${indexPath}`);
      res.status(404).json({ 
        error: 'Frontend build not found',
        message: 'Please run "npm run build" in the client directory to generate the dist folder.'
      });
    }
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Fallback for 404 API routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Widget Date Server running on http://localhost:${env.PORT}`);
  console.log(`   Health: http://localhost:${env.PORT}/api/health`);
  console.log(`   CORS origin: ${env.CLIENT_ORIGIN}`);
});
