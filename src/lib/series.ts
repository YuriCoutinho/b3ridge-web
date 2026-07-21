import type { TickerHistoryPoint } from '@/services/tickers';

export interface PercentPoint {
  date: number;
  changePct: number;
}

export type ChartRow = { date: number } & Record<string, number>;

const paletteSize = 8;

export function colorVarForIndex(index: number): string {
  return `var(--chart-${(index % paletteSize) + 1})`;
}

export function isDashedForIndex(index: number): boolean {
  return index >= paletteSize;
}

export function formatChangePct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function toPercentSeries(points: TickerHistoryPoint[]): PercentPoint[] {
  const base = points[0]?.close;
  if (!base) {
    return [];
  }

  return points.map((point) => ({
    date: point.date,
    changePct: (point.close / base - 1) * 100,
  }));
}

export function lastChangePct(points: PercentPoint[]): number {
  return points.at(-1)?.changePct ?? 0;
}

export function buildChartRows(
  series: { symbol: string; points: PercentPoint[] }[],
): ChartRow[] {
  const rowByDate = new Map<number, ChartRow>();

  for (const { symbol, points } of series) {
    for (const point of points) {
      const row = rowByDate.get(point.date) ?? { date: point.date };
      row[symbol] = point.changePct;
      rowByDate.set(point.date, row);
    }
  }

  return [...rowByDate.values()].sort((a, b) => a.date - b.date);
}
