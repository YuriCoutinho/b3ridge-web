import type { NextFunction, Request, Response } from 'express';
import { tickerHistoryQuerySchema } from '@b3ridge/contracts';
import { z } from 'zod';
import { getTickerHistory } from '../services/history.service.js';

// B3 tickers: 5-7 uppercase alphanumeric chars (e.g. PETR4, BPAC11, KLBN11F)
const paramsSchema = z.object({ symbol: z.string().regex(/^[A-Z0-9]{5,7}$/) });

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const params = paramsSchema.safeParse(req.params);
  const query = tickerHistoryQuerySchema.safeParse(req.query);

  if (!params.success || !query.success) {
    res.status(400).json({ error: 'Invalid request parameters' });
    return;
  }

  try {
    res.json(await getTickerHistory(params.data.symbol, query.data));
  } catch (error) {
    next(error);
  }
}
