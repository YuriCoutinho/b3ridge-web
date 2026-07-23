import { Router } from 'express';
import { historyRouter } from './history.router.js';
import { tickersRouter } from './tickers.router.js';

export const apiRouter = Router();

apiRouter.use(tickersRouter);
apiRouter.use(historyRouter);
