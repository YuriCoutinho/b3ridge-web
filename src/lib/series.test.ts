import { describe, it, expect } from 'vitest';
import {
  buildChartRows,
  colorVarForIndex,
  formatChangePct,
  isDashedForIndex,
  lastChangePct,
  toPercentSeries,
} from '@/lib/series';
import type { TickerHistoryPoint } from '@/services/tickers';

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

describe('toPercentSeries', () => {
  it('normalizes closes into percent change from the first close', () => {
    const series = toPercentSeries([
      point(1, 100),
      point(2, 110),
      point(3, 95),
    ]);

    expect(series.map((entry) => entry.date)).toEqual([1, 2, 3]);
    expect(series[0].changePct).toBe(0);
    expect(series[1].changePct).toBeCloseTo(10, 10);
    expect(series[2].changePct).toBeCloseTo(-5, 10);
  });

  it('returns empty when there is no base close', () => {
    expect(toPercentSeries([])).toEqual([]);
    expect(toPercentSeries([point(1, 0)])).toEqual([]);
  });
});

describe('buildChartRows', () => {
  it('merges series by date and sorts ascending', () => {
    const rows = buildChartRows([
      {
        symbol: 'PETR4',
        points: [
          { date: 2, changePct: 1 },
          { date: 1, changePct: 0 },
        ],
      },
      {
        symbol: 'VALE3',
        points: [
          { date: 1, changePct: 0 },
          { date: 3, changePct: 5 },
        ],
      },
    ]);

    expect(rows).toEqual([
      { date: 1, PETR4: 0, VALE3: 0 },
      { date: 2, PETR4: 1 },
      { date: 3, VALE3: 5 },
    ]);
  });
});

describe('colorVarForIndex / isDashedForIndex', () => {
  it('assigns palette colors in fixed order and wraps after 8', () => {
    expect(colorVarForIndex(0)).toBe('var(--chart-1)');
    expect(colorVarForIndex(7)).toBe('var(--chart-8)');
    expect(colorVarForIndex(8)).toBe('var(--chart-1)');
  });

  it('dashes only the repeated colors past the palette', () => {
    expect(isDashedForIndex(7)).toBe(false);
    expect(isDashedForIndex(8)).toBe(true);
  });
});

describe('formatChangePct / lastChangePct', () => {
  it('signs the value and keeps two decimals', () => {
    expect(formatChangePct(5.618)).toBe('+5.62%');
    expect(formatChangePct(-4)).toBe('-4.00%');
  });

  it('reads the last percent point, defaulting to zero', () => {
    expect(
      lastChangePct([
        { date: 1, changePct: 0 },
        { date: 2, changePct: 3 },
      ]),
    ).toBe(3);
    expect(lastChangePct([])).toBe(0);
  });
});
