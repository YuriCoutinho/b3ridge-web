import { Router } from 'express';
import { getHistory } from '../controllers/history.controller.js';

export const historyRouter = Router();

historyRouter.get('/tickers/:symbol/history', getHistory);
