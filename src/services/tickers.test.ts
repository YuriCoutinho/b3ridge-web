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
  it('returns only symbol and name, discarding the rest of the payload', async () => {
    stubFetch({
      results: [
        { symbol: 'PETR4', name: 'Petrobras', quote: {}, sector: 'x' },
        { symbol: 'VALE3', name: 'Vale', quote: {}, sector: 'y' },
      ],
    });

    const result = await fetchTickers();

    expect(result).toEqual([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'VALE3', name: 'Vale' },
    ]);
  });
});

describe('fetchTickerHistory', () => {
  it('returns the historicalDataPrice points', async () => {
    const point = {
      date: 1,
      open: 1,
      high: 2,
      low: 0,
      close: 1.5,
      volume: 100,
      adjustedClose: 1.5,
    };
    stubFetch({ results: [{ data: { historicalDataPrice: [point] } }] });

    const result = await fetchTickerHistory('PETR4', range);

    expect(result).toEqual([point]);
  });

  it('sends symbols, startDate and endDate in the query', async () => {
    const fetchMock = stubFetch({ results: [] });

    await fetchTickerHistory('PETR4', range);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('symbols=PETR4');
    expect(url).toContain('startDate=2026-07-12');
    expect(url).toContain('endDate=2026-07-19');
  });

  it('throws ApiError carrying the status when the response is not ok', async () => {
    stubFetch({}, false, 404);

    await expect(fetchTickerHistory('XXXX', range)).rejects.toMatchObject({
      status: 404,
    });
  });

  it('returns an empty list when results is empty', async () => {
    stubFetch({ results: [] });

    const result = await fetchTickerHistory('XXXX', range);

    expect(result).toEqual([]);
  });
});
