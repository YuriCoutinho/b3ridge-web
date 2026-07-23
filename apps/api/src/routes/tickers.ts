import { Router } from 'express';
import { getTickers } from '../services/tickers.service.js';

export const tickersRouter = Router();

tickersRouter.get('/tickers', async (_req, res, next) => {
  try {
    const tickers = await getTickers();
    res.json(tickers);
  } catch (error) {
    next(error);
  }
});
