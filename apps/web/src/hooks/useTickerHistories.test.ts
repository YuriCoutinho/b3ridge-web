import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useTickerHistories } from '@/hooks/useTickerHistories';
import { fetchTickerHistories, type Ticker } from '@/services/tickers';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/services/tickers');

const range = { startDate: '2020-01-01', endDate: '2020-02-01' };
const tickers: Ticker[] = [
  { symbol: 'PETR4', name: 'Petrobras' },
  { symbol: 'VALE3', name: 'Vale' },
];

function point(date: number) {
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

afterEach(() => {
  vi.resetAllMocks();
});

describe('useTickerHistories', () => {
  it('fetches once and maps each symbol result, isolating per-symbol errors', async () => {
    vi.mocked(fetchTickerHistories).mockResolvedValue([
      { symbol: 'PETR4', status: 'ok', history: [point(1)] },
      { symbol: 'VALE3', status: 'error', reason: 'not_found' },
    ]);

    const { result } = renderHook(() => useTickerHistories(tickers, range), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.PETR4.data).toEqual([point(1)]);
    });
    expect(result.current.PETR4.isError).toBe(false);
    expect(result.current.PETR4.reason).toBe(null);
    expect(result.current.VALE3.data).toEqual([]);
    expect(result.current.VALE3.isError).toBe(true);
    expect(result.current.VALE3.reason).toBe('not_found');
    expect(fetchTickerHistories).toHaveBeenCalledTimes(1);
    expect(fetchTickerHistories).toHaveBeenCalledWith(
      ['PETR4', 'VALE3'],
      range,
    );
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

    expect(fetchTickerHistories).not.toHaveBeenCalled();
  });

  it('does not fetch when nothing is selected', () => {
    renderHook(() => useTickerHistories([], range), {
      wrapper: createQueryWrapper(),
    });

    expect(fetchTickerHistories).not.toHaveBeenCalled();
  });
});
