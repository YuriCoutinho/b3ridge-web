import { z } from 'zod';
import { env } from '../config/env.js';

const BRAPI_TICKERS_URL = 'https://brapi.dev/api/v2/tickers';
const PAGE_LIMIT = 2000;
const REQUEST_TIMEOUT_MS = 8000;
const SORT_BY = 'marketCap';
const SORT_ORDER = 'desc';

const brapiTickerSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  longName: z.string().nullish(),
});
export type BrapiTicker = z.infer<typeof brapiTickerSchema>;

const brapiPageSchema = z.object({
  results: z.array(brapiTickerSchema),
  pagination: z.object({ totalItems: z.number() }),
});
export type BrapiPage = z.infer<typeof brapiPageSchema>;

export class BrapiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrapiError';
    this.status = status;
  }
}

function brapiHeaders(): Record<string, string> {
  return env.brapiToken ? { Authorization: `Bearer ${env.brapiToken}` } : {};
}

export async function fetchTickersPage(page: number): Promise<BrapiPage> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_LIMIT),
    sortBy: SORT_BY,
    sortOrder: SORT_ORDER,
  });

  let response: Response;
  try {
    response = await fetch(`${BRAPI_TICKERS_URL}?${query}`, {
      headers: brapiHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new BrapiError(
      `brapi request failed: ${(error as Error).message}`,
      503,
    );
  }

  if (!response.ok) {
    throw new BrapiError(`brapi responded ${response.status}`, 502);
  }

  const parsed = brapiPageSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new BrapiError('unexpected brapi payload shape', 502);
  }

  return parsed.data;
}
