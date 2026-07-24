import { Router } from 'express';

import { getHistory } from '../controllers/history.controller.js';
import { listTickers } from '../controllers/tickers.controller.js';
import { tickersRateLimiter } from '../middlewares/rateLimiter.js';

export const tickersRouter = Router();

tickersRouter.use(tickersRateLimiter);

tickersRouter.get('/', listTickers);
tickersRouter.get('/history', getHistory);
