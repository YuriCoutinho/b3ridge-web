import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import {
  fetchTickerHistory,
  type Ticker,
  type TickerHistoryPoint,
} from '@/services/tickers';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/services/tickers');

const range = { startDate: '2020-01-01', endDate: '2020-02-01' };
const tickers: Ticker[] = [
  { symbol: 'PETR4', name: 'Petrobras' },
  { symbol: 'VALE3', name: 'Vale' },
];

function pointFor(symbol: string): TickerHistoryPoint {
  return {
    date: symbol.length,
    open: 1,
    high: 2,
    low: 0,
    close: 1.5,
    volume: 100,
    adjustedClose: 1.5,
  };
}

afterEach(() => {
  vi.resetAllMocks();
});

describe('useTickerHistories', () => {
  it('indexes each symbol result by symbol', async () => {
    vi.mocked(fetchTickerHistory).mockImplementation(async (symbol) => [
      pointFor(symbol),
    ]);

    const { result } = renderHook(() => useTickerHistories(tickers, range), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.PETR4.data).toEqual([pointFor('PETR4')]);
      expect(result.current.VALE3.data).toEqual([pointFor('VALE3')]);
    });
    expect(fetchTickerHistory).toHaveBeenCalledTimes(2);
  });

  it('does not fetch when the range is invalid', () => {
    renderHook(
      () =>
        useTickerHistories(tickers, {
          startDate: '2026-07-19',
          endDate: '2026-07-12',
        }),
      { wrapper: createQueryWrapper() },
    );

    expect(fetchTickerHistory).not.toHaveBeenCalled();
  });
});
