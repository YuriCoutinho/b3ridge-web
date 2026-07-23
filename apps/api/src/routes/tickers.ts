import { Router } from 'express';
import { listTickers } from '../controllers/tickers.controller.js';

export const tickersRouter = Router();

tickersRouter.get('/tickers', listTickers);
