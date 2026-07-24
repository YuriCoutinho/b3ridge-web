import type { NextFunction, Request, Response } from 'express';

import { getTickers } from '../services/tickers.service.js';

export async function listTickers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json(await getTickers());
  } catch (error) {
    next(error);
  }
}
