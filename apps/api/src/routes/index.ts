import { Router } from 'express';

import { tickersRouter } from './tickers.router.js';

export const apiRouter = Router();

apiRouter.use('/tickers', tickersRouter);
