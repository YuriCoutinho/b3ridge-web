import { describe, it, expect } from 'vitest';
import {
  buildChartRows,
  colorVarForIndex,
  formatChangePct,
  lastChangePct,
  toPercentSeries,
} from '@/lib/series';
import type { TickerHistoryPoint } from '@/services/tickers';

const DAY = 86400;

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
      point(DAY, 100),
      point(2 * DAY, 110),
      point(3 * DAY, 95),
    ]);

    expect(series).toHaveLength(3);
    expect(series[0].changePct).toBe(0);
    expect(series[1].changePct).toBeCloseTo(10, 10);
    expect(series[2].changePct).toBeCloseTo(-5, 10);
  });

  it('anchors the base on the earliest date even if input is unordered', () => {
    const series = toPercentSeries([
      point(3 * DAY, 95),
      point(DAY, 100),
      point(2 * DAY, 110),
    ]);

    const dates = series.map((entry) => entry.date);
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
    expect(series[0].changePct).toBe(0);
    expect(series[2].changePct).toBeCloseTo(-5, 10);
  });

  it('returns empty when there is no base close', () => {
    expect(toPercentSeries([])).toEqual([]);
    expect(toPercentSeries([point(DAY, 0)])).toEqual([]);
  });

  it('aligns points on the same calendar day despite differing intraday timestamps', () => {
    const midnight = 1784257200;
    const tenAm = midnight + 10 * 3600;

    const rows = buildChartRows([
      { symbol: 'AAA', points: toPercentSeries([point(midnight, 100)]) },
      { symbol: 'BBB', points: toPercentSeries([point(tenAm, 100)]) },
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ AAA: 0, BBB: 0 });
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

describe('colorVarForIndex', () => {
  it('assigns palette colors in fixed order and wraps after 8', () => {
    expect(colorVarForIndex(0)).toBe('var(--chart-1)');
    expect(colorVarForIndex(7)).toBe('var(--chart-8)');
    expect(colorVarForIndex(8)).toBe('var(--chart-1)');
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
