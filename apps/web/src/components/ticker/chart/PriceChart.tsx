import { lazy, Suspense } from 'react';

import { ChartLoadError } from '@/components/ticker/chart/ChartLoadError';
import { ChartRangeHint } from '@/components/ticker/chart/ChartRangeHint';
import { ChartSection } from '@/components/ticker/chart/ChartSection';
import { ChartSkeleton } from '@/components/ticker/chart/ChartSkeleton';
import { EmptyTickerSelection } from '@/components/ticker/chart/EmptyTickerSelection';
import { useChartData } from '@/hooks/useChartData';
import type { DateRange } from '@/lib/dateRange';
import type { Ticker } from '@/services/tickers';

const PriceChartCanvas = lazy(() =>
  import('@/components/ticker/chart/PriceChartCanvas').then((module) => ({
    default: module.PriceChartCanvas,
  })),
);

interface PriceChartProps {
  tickers: Ticker[];
  range: DateRange;
}

interface PriceChartViewProps {
  selected: Ticker[];
  range: DateRange;
}

export function PriceChart({ tickers, range }: PriceChartProps) {
  if (tickers.length === 0) {
    return (
      <ChartSection>
        <EmptyTickerSelection />
      </ChartSection>
    );
  }

  return <PriceChartView selected={tickers} range={range} />;
}

function PriceChartView({ selected, range }: PriceChartViewProps) {
  const data = useChartData(selected, range);

  switch (data.status) {
    case 'invalid-range':
      return (
        <ChartSection>
          <ChartRangeHint />
        </ChartSection>
      );
    case 'loading':
      return (
        <ChartSection>
          <ChartSkeleton symbols={data.symbols} />
        </ChartSection>
      );
    case 'error':
      return (
        <ChartSection>
          <ChartLoadError
            allNotFound={data.allNotFound}
            lines={data.failureLines}
          />
        </ChartSection>
      );
    case 'ready':
      return (
        <ChartSection
          description={`${data.rows.length} pregões · variação % desde o início do período`}
        >
          <Suspense
            fallback={
              <ChartSkeleton symbols={data.series.map((item) => item.symbol)} />
            }
          >
            <PriceChartCanvas
              rows={data.rows}
              config={data.config}
              series={data.series}
              summaries={data.summaries}
              failureLines={data.failureLines}
            />
          </Suspense>
        </ChartSection>
      );
  }
}
