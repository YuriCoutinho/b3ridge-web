import type { NextFunction, Request, Response } from 'express';

import { BrapiError } from '../clients/brapi/errors.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof BrapiError) {
    console.error(`brapi error (${err.status}): ${err.message}`);
    const error =
      err.status === 404 ? 'Ticker not found' : 'Upstream data source error';
    res.status(err.status).json({ error });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
