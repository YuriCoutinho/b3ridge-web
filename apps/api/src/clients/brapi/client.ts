import { env } from '../../config/env.js';
import { toMessage } from '../../lib/toMessage.js';
import { brapiPageSchema, type BrapiPage } from './schemas.js';
import { BrapiError } from './errors.js';

const BRAPI_TICKERS_URL = 'https://brapi.dev/api/v2/tickers';
const PAGE_LIMIT = 2000;
const REQUEST_TIMEOUT_MS = 8000;
const SORT_BY = 'marketCap';
const SORT_ORDER = 'desc';

function brapiHeaders(): Record<string, string> {
  return env.brapiToken ? { Authorization: `Bearer ${env.brapiToken}` } : {};
}

async function fetchTickersPage(page: number): Promise<BrapiPage> {
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
    throw new BrapiError(`brapi request failed: ${toMessage(error)}`, 503);
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

export async function fetchAllTickerPages(): Promise<BrapiPage[]> {
  const firstPage = await fetchTickersPage(1);
  const totalPages = Math.ceil(firstPage.pagination.totalItems / PAGE_LIMIT);

  const remainingPages: Promise<BrapiPage>[] = [];
  for (let page = 2; page <= totalPages; page += 1) {
    remainingPages.push(fetchTickersPage(page));
  }

  const rest = await Promise.all(remainingPages);
  return [firstPage, ...rest];
}
