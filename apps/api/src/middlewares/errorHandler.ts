import type { ErrorRequestHandler } from 'express';
import { BrapiError } from '../clients/brapi.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BrapiError) {
    console.error(`brapi error (${err.status}): ${err.message}`);
    res.status(err.status).json({ error: 'Upstream data source error' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};
