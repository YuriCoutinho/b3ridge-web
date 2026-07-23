import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { getTickerHistory } from '../services/history.service.js';

const paramsSchema = z.object({ symbol: z.string().min(1) });
const querySchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const params = paramsSchema.safeParse(req.params);
  const query = querySchema.safeParse(req.query);

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
