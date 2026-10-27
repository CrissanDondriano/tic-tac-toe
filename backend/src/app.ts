import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { pinoHttp } from 'pino-http';
import { env } from './config/env';
import { logger } from './logger';
import { errorHandler, notFound } from './middleware/errors';
import gamesRouter from './routes/games';
import leaderboardRouter from './routes/leaderboard';

const WINDOW_MS = 15 * 60 * 1000;
const tooManyRequests = { error: 'Too many requests, please try again later.' };

const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooManyRequests,
});

const saveLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooManyRequests,
  skip: (req) => req.method !== 'POST',
});

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/api/health' } }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({
      status: dbUp ? 'ok' : 'degraded',
      db: dbUp ? 'up' : 'down',
      uptime: Math.round(process.uptime()),
    });
  });

  app.use('/api', apiLimiter);
  app.use('/api/games', saveLimiter, gamesRouter);
  app.use('/api/leaderboard', leaderboardRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
