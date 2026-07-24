import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchTickers, fetchTickerHistories } from '@/services/tickers';

const range = { startDate: '2026-07-12', endDate: '2026-07-19' };

function stubFetch(body: unknown, ok = true, status = 200) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok, status, json: async () => body });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchTickers', () => {
  it('returns the ticker list from the internal API', async () => {
    stubFetch([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'HGLG11', name: 'CSHG Logística' },
    ]);

    const result = await fetchTickers();

    expect(result).toEqual([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'HGLG11', name: 'CSHG Logística' },
    ]);
  });

  it('requests the internal /api/tickers endpoint', async () => {
    const fetchMock = stubFetch([]);

    await fetchTickers();

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/tickers');
  });
});

describe('fetchTickerHistories', () => {
  const point = {
    date: 1,
    open: 1,
    high: 2,
    low: 0,
    close: 1.5,
    volume: 100,
    adjustedClose: 1.5,
  };

  it('returns the per-symbol results from the internal API', async () => {
    const body = [
      { symbol: 'PETR4', status: 'ok', history: [point] },
      { symbol: 'XXXXX', status: 'error', reason: 'not_found' },
    ];
    stubFetch(body);

    const result = await fetchTickerHistories(['PETR4', 'XXXXX'], range);

    expect(result).toEqual(body);
  });

  it('requests the internal /api/tickers/history endpoint with symbols and date range', async () => {
    const fetchMock = stubFetch([]);

    await fetchTickerHistories(['PETR4', 'VALE3'], range);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/tickers/history');
    expect(url).toContain('symbols=PETR4%2CVALE3');
    expect(url).toContain('startDate=2026-07-12');
    expect(url).toContain('endDate=2026-07-19');
  });

  it('throws ApiError carrying the status when the response is not ok', async () => {
    stubFetch({}, false, 400);

    await expect(fetchTickerHistories(['PETR4'], range)).rejects.toMatchObject({
      status: 400,
    });
  });

  it('throws ApiError when the response does not match the schema', async () => {
    stubFetch([{ symbol: 'PETR4', status: 'ok' }]);

    await expect(fetchTickerHistories(['PETR4'], range)).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
    });
  });
});
