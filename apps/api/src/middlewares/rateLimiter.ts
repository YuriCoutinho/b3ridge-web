import rateLimit from 'express-rate-limit';

function createRateLimiter(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export const globalRateLimiter = createRateLimiter(15 * 60 * 1000, 100);
export const tickersRateLimiter = createRateLimiter(60 * 1000, 30);
