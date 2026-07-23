import { brapiGet } from './httpClient.js';
import { brapiPageSchema, type BrapiPage } from './schemas.js';

const PAGE_LIMIT = 2000;
const SORT_BY = 'marketCap';
const SORT_ORDER = 'desc';

async function fetchTickersPage(page: number): Promise<BrapiPage> {
  return brapiGet(
    '/v2/tickers',
    {
      page: String(page),
      limit: String(PAGE_LIMIT),
      sortBy: SORT_BY,
      sortOrder: SORT_ORDER,
    },
    brapiPageSchema,
  );
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
