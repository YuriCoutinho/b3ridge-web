import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PriceChart } from '@/components/ticker/chart/PriceChart';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import { resolveRange } from '@/lib/dateRange';
import type { Ticker, TickerHistoryPoint } from '@/services/tickers';

vi.mock('@/hooks/useTickerHistories', () => ({
  useTickerHistories: vi.fn(),
}));

const mockedHistories = vi.mocked(useTickerHistories);

const selected: Ticker[] = [
  { symbol: 'PETR4', name: 'Petrobras' },
  { symbol: 'VALE3', name: 'Vale' },
];
const validRange = resolveRange('1m');

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
  return { data, isPending: false, isError: false, reason: null };
}

function failed(reason: 'not_found' | 'upstream_error') {
  return {
    data: [],
    isPending: false,
    isError: true,
    reason,
  };
}

describe('PriceChart', () => {
  beforeEach(() => mockedHistories.mockReset());

  it('shows a partial-failure alert mapping the backend reason while still drawing the valid series', async () => {
    mockedHistories.mockReturnValue({
      PETR4: ok([point(1, 100), point(2, 110)]),
      VALE3: failed('upstream_error'),
    });

    render(<PriceChart tickers={selected} range={validRange} />);

    expect(
      await screen.findByText('Alguns ativos não carregaram.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('VALE3 · falha temporária, tente novamente'),
    ).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('PETR4');
  });

  it('shows the empty selection state when nothing was queried', () => {
    mockedHistories.mockReturnValue({});

    render(<PriceChart tickers={[]} range={validRange} />);

    expect(screen.getByText('Nenhum ativo consultado')).toBeInTheDocument();
  });

  it('shows a not-found error state when every series is missing upstream', () => {
    mockedHistories.mockReturnValue({
      PETR4: failed('not_found'),
      VALE3: failed('not_found'),
    });

    render(<PriceChart tickers={selected} range={validRange} />);

    expect(screen.getByText('Nenhuma cotação encontrada.')).toBeInTheDocument();
    expect(
      screen.getByText('PETR4, VALE3 · sem cotações disponíveis'),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('shows a generic total-failure state when an upstream error is present', () => {
    mockedHistories.mockReturnValue({
      PETR4: failed('not_found'),
      VALE3: failed('upstream_error'),
    });

    render(<PriceChart tickers={selected} range={validRange} />);

    expect(
      screen.getByText('Não foi possível carregar as cotações.'),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
