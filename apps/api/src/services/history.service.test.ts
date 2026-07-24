import type { TickerHistoryPoint } from '@b3ridge/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getJson, setJson } from '../cache/redis.js';
import { BrapiError } from '../clients/brapi/errors.js';
import { fetchTickerHistory } from '../clients/brapi/history/client.js';
import { getTickerHistories } from './history.service.js';

vi.mock('../clients/brapi/history/client.js', () => ({
  fetchTickerHistory: vi.fn(),
}));
vi.mock('../cache/redis.js', () => ({ getJson: vi.fn(), setJson: vi.fn() }));

const range = { startDate: '2024-01-01', endDate: '2024-02-01' };
const fetchMock = vi.mocked(fetchTickerHistory);
const getJsonMock = vi.mocked(getJson);

function point(date: number): TickerHistoryPoint {
  return {
    date,
    open: 1,
    high: 2,
    low: 0,
    close: 1.5,
    volume: 100,
    adjustedClose: 1.5,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  getJsonMock.mockResolvedValue(null);
  vi.mocked(setJson).mockResolvedValue(undefined);
});

describe('getTickerHistories', () => {
  it('returns an ok result per symbol carrying its history', async () => {
    fetchMock.mockImplementation(async (symbol) => [point(symbol.length)]);

    const result = await getTickerHistories(['PETR4', 'VALE3'], range);

    expect(result).toEqual([
      { symbol: 'PETR4', status: 'ok', history: [point(5)] },
      { symbol: 'VALE3', status: 'ok', history: [point(5)] },
    ]);
  });

  it('isolates failures per symbol, mapping the brapi status to a reason', async () => {
    fetchMock.mockImplementation(async (symbol) => {
      if (symbol === 'XXXXX') throw new BrapiError('not found', 404);
      if (symbol === 'YYYYY') throw new BrapiError('bad gateway', 502);
      return [point(1)];
    });

    const result = await getTickerHistories(['PETR4', 'XXXXX', 'YYYYY'], range);

    expect(result).toEqual([
      { symbol: 'PETR4', status: 'ok', history: [point(1)] },
      { symbol: 'XXXXX', status: 'error', reason: 'not_found' },
      { symbol: 'YYYYY', status: 'error', reason: 'upstream_error' },
    ]);
  });

  it('serves cached history without hitting brapi', async () => {
    getJsonMock.mockResolvedValueOnce([point(9)]);

    const result = await getTickerHistories(['PETR4'], range);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual([
      { symbol: 'PETR4', status: 'ok', history: [point(9)] },
    ]);
  });
});
