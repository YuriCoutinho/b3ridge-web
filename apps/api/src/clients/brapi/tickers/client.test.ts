import { beforeEach, describe, expect, it, vi } from 'vitest';

import { brapiGet } from '../httpClient.js';
import { fetchTickers } from './client.js';
import type { BrapiPage, BrapiTicker } from './schema.js';

vi.mock('../httpClient.js', () => ({ brapiGet: vi.fn() }));

const brapiGetMock = vi.mocked(brapiGet);

function ticker(symbol: string): BrapiTicker {
  return { symbol, name: symbol, longName: null };
}

function page(results: BrapiTicker[], totalItems: number): BrapiPage {
  return { results, pagination: { totalItems } };
}

beforeEach(() => {
  brapiGetMock.mockReset();
});

describe('fetchTickers', () => {
  it('fetches a single page when the total fits within one page', async () => {
    brapiGetMock.mockResolvedValueOnce(
      page([ticker('PETR4'), ticker('VALE3')], 2),
    );

    const result = await fetchTickers();

    expect(brapiGetMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { symbol: 'PETR4', name: 'PETR4' },
      { symbol: 'VALE3', name: 'VALE3' },
    ]);
  });

  it('fetches every remaining page and concatenates results in page order', async () => {
    brapiGetMock
      .mockResolvedValueOnce(page([ticker('P1')], 4001))
      .mockResolvedValueOnce(page([ticker('P2')], 4001))
      .mockResolvedValueOnce(page([ticker('P3')], 4001));

    const result = await fetchTickers();

    expect(brapiGetMock).toHaveBeenCalledTimes(3);
    expect(
      brapiGetMock.mock.calls.map(
        (call) => (call[1] as Record<string, string>).page,
      ),
    ).toEqual(['1', '2', '3']);
    expect(result.map((entry) => entry.symbol)).toEqual(['P1', 'P2', 'P3']);
  });

  it('returns an empty list when there are no tickers', async () => {
    brapiGetMock.mockResolvedValueOnce(page([], 0));

    const result = await fetchTickers();

    expect(brapiGetMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
