import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PriceChart } from '@/components/ticker/PriceChart';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import type { Ticker, TickerHistoryPoint } from '@/services/tickers';

vi.mock('@/hooks/useTickerHistories', () => ({
  useTickerHistories: vi.fn(),
}));

const mockedHistories = vi.mocked(useTickerHistories);

const selected: Ticker[] = [
  { symbol: 'PETR4', name: 'Petrobras' },
  { symbol: 'VALE3', name: 'Vale' },
];
const validRange = { startDate: '2020-01-01', endDate: '2020-02-01' };

function point(date: number, close: number): TickerHistoryPoint {
  return {
    date,
    open: close,
    high: close,
    low: close,
    close,
    volume: 0,
    adjustedClose: close,
  };
}

function ok(data: TickerHistoryPoint[]) {
  return { data, isPending: false, isError: false, error: null };
}

function failed(message: string) {
  return {
    data: [],
    isPending: false,
    isError: true,
    error: new Error(message),
  };
}

describe('PriceChart', () => {
  beforeEach(() => mockedHistories.mockReset());

  it('shows a partial-failure alert while still drawing the valid series', () => {
    mockedHistories.mockReturnValue({
      PETR4: ok([point(1, 100), point(2, 110)]),
      VALE3: failed('timeout'),
    });

    render(<PriceChart selected={selected} range={validRange} />);

    expect(
      screen.getByText('Alguns ativos não carregaram.'),
    ).toBeInTheDocument();
    expect(screen.getByText('VALE3')).toBeInTheDocument();
    expect(screen.queryByText(/timeout/)).not.toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('PETR4');
  });

  it('shows a total-failure error state when every series fails', () => {
    mockedHistories.mockReturnValue({
      PETR4: failed('500'),
      VALE3: failed('timeout'),
    });

    render(<PriceChart selected={selected} range={validRange} />);

    expect(
      screen.getByText('Não foi possível carregar as cotações.'),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
