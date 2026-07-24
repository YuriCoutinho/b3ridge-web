import { tickerHistoryBatchQuerySchema } from '@b3ridge/contracts';
import type { NextFunction, Request, Response } from 'express';

import { getTickerHistories } from '../services/history.service.js';

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const query = tickerHistoryBatchQuerySchema.safeParse(req.query);

  if (!query.success) {
    res.status(400).json({ error: query.error.issues[0].message });
    return;
  }

  try {
    const { symbols, ...range } = query.data;
    res.json(await getTickerHistories(symbols, range));
  } catch (error) {
    next(error);
  }
}
