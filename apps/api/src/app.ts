import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { docsRouter } from './routes/docs.router.js';
import { healthRouter } from './routes/health.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));

  app.use(healthRouter);
  app.use('/api/docs', docsRouter);

  app.use(globalRateLimiter);

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
