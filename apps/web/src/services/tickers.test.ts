import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchTickers, fetchTickerHistory } from '@/services/tickers';

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

describe('fetchTickerHistory', () => {
  it('returns the history points from the internal API', async () => {
    const point = {
      date: 1,
      open: 1,
      high: 2,
      low: 0,
      close: 1.5,
      volume: 100,
      adjustedClose: 1.5,
    };
    stubFetch([point]);

    const result = await fetchTickerHistory('PETR4', range);

    expect(result).toEqual([point]);
  });

  it('requests the internal /api/tickers/:symbol/history endpoint with startDate and endDate', async () => {
    const fetchMock = stubFetch([]);

    await fetchTickerHistory('PETR4', range);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/tickers/PETR4/history');
    expect(url).toContain('startDate=2026-07-12');
    expect(url).toContain('endDate=2026-07-19');
  });

  it('throws ApiError carrying the status when the response is not ok', async () => {
    stubFetch({}, false, 404);

    await expect(fetchTickerHistory('XXXX', range)).rejects.toMatchObject({
      status: 404,
    });
  });

  it('throws ApiError when the response does not match the schema', async () => {
    stubFetch([{ date: 'nope' }]);

    await expect(fetchTickerHistory('PETR4', range)).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
    });
  });

  it('returns an empty list when the API returns no points', async () => {
    stubFetch([]);

    const result = await fetchTickerHistory('XXXX', range);

    expect(result).toEqual([]);
  });
});
