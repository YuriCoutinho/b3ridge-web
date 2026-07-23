import type { NextFunction, Request, Response } from 'express';
import { BrapiError } from '../clients/brapi.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof BrapiError) {
    console.error(`brapi error (${err.status}): ${err.message}`);
    res.status(err.status).json({ error: 'Upstream data source error' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
