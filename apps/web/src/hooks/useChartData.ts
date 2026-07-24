import type { ChartConfig } from '@/components/ui/chart';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import { isValidRange, maxEndDateIso, type DateRange } from '@/lib/dateRange';
import {
  buildChartRows,
  colorVarForIndex,
  lastChangePct,
  toPercentSeries,
  type ChartRow,
  type PercentPoint,
} from '@/lib/series';
import type { HistoryErrorReason, Ticker } from '@/services/tickers';

export interface ChartSeries {
  symbol: string;
  points: PercentPoint[];
  colorVar: string;
}

export interface ChartSummary {
  symbol: string;
  changePct: number;
  colorVar: string;
}

export type ChartData =
  | { status: 'invalid-range' }
  | { status: 'loading'; symbols: string[] }
  | { status: 'error'; allNotFound: boolean; failureLines: string[] }
  | {
      status: 'ready';
      rows: ChartRow[];
      config: ChartConfig;
      series: ChartSeries[];
      summaries: ChartSummary[];
      failureLines: string[];
    };

const failureMessages: Record<HistoryErrorReason, string> = {
  not_found: 'sem cotações disponíveis',
  upstream_error: 'falha temporária, tente novamente',
};

const failureOrder: HistoryErrorReason[] = ['not_found', 'upstream_error'];

function describeFailures(
  failed: { symbol: string; reason: HistoryErrorReason | null }[],
): string[] {
  return failureOrder.flatMap((reason) => {
    const symbols = failed
      .filter((entry) => (entry.reason ?? 'upstream_error') === reason)
      .map((entry) => entry.symbol);
    return symbols.length > 0
      ? [`${symbols.join(', ')} · ${failureMessages[reason]}`]
      : [];
  });
}

export function useChartData(selected: Ticker[], range: DateRange): ChartData {
  const histories = useTickerHistories(selected, range);

  const entries = selected.map((ticker, index) => ({
    ticker,
    index,
    ...histories[ticker.symbol],
  }));

  if (!isValidRange(range, maxEndDateIso())) {
    return { status: 'invalid-range' };
  }

  if (entries.some((entry) => entry.isPending)) {
    return {
      status: 'loading',
      symbols: selected.map((ticker) => ticker.symbol),
    };
  }

  const failed = entries
    .filter((entry) => entry.isError)
    .map((entry) => ({ symbol: entry.ticker.symbol, reason: entry.reason }));
  const failureLines = describeFailures(failed);
  const series = entries
    .filter((entry) => !entry.isError)
    .map((entry) => ({
      symbol: entry.ticker.symbol,
      points: toPercentSeries(entry.data),
      colorVar: colorVarForIndex(entry.index),
    }))
    .filter((item) => item.points.length > 0);

  if (series.length === 0) {
    return {
      status: 'error',
      allNotFound: failed.every((entry) => entry.reason === 'not_found'),
      failureLines,
    };
  }

  const rows = buildChartRows(series);
  const config: ChartConfig = Object.fromEntries(
    series.map((item) => [
      item.symbol,
      { label: item.symbol, color: item.colorVar },
    ]),
  );
  const summaries = series.map((item) => ({
    symbol: item.symbol,
    changePct: lastChangePct(item.points),
    colorVar: item.colorVar,
  }));

  return { status: 'ready', rows, config, series, summaries, failureLines };
}
