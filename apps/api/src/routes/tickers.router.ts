import { Router } from 'express';
import { getHistory } from '../controllers/history.controller.js';
import { listTickers } from '../controllers/tickers.controller.js';

export const tickersRouter = Router();

tickersRouter.get('/', listTickers);
tickersRouter.get('/:symbol/history', getHistory);
