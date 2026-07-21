import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartTooltipRow } from '@/components/ticker/ChartTooltipRow';
import { EmptyTickerSelection } from '@/components/ticker/EmptyTickerSelection';
import { TickerSummaryList } from '@/components/ticker/TickerSummaryList';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import { isValidRange, maxEndDateIso, type DateRange } from '@/lib/dateRange';
import {
  buildChartRows,
  colorVarForIndex,
  lastChangePct,
  toPercentSeries,
} from '@/lib/series';
import type { Ticker } from '@/services/tickers';

interface PriceChartProps {
  selected: Ticker[];
  range: DateRange;
}

function ChartSection({
  description,
  children,
}: {
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Comparativo de ativos
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </section>
  );
}

function formatDateTick(value: number): string {
  return format(new Date(value * 1000), 'dd/MM');
}

function formatPercentTick(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`;
}

export function PriceChart({ selected, range }: PriceChartProps) {
  const histories = useTickerHistories(selected, range);

  if (selected.length === 0) {
    return (
      <ChartSection>
        <EmptyTickerSelection />
      </ChartSection>
    );
  }

  if (!isValidRange(range, maxEndDateIso())) {
    return (
      <ChartSection>
        <p className="text-sm text-muted-foreground">
          Ajuste o período para consultar as cotações.
        </p>
      </ChartSection>
    );
  }

  const entries = selected.map((ticker, index) => ({
    ticker,
    index,
    ...histories[ticker.symbol],
  }));

  if (entries.some((entry) => entry.isPending)) {
    return (
      <ChartSection>
        <Skeleton className="aspect-auto h-[360px] w-full lg:h-[460px] xl:h-[560px]" />
        <div className="flex flex-wrap gap-2">
          {selected.map((ticker) => (
            <Skeleton key={ticker.symbol} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </ChartSection>
    );
  }

  const failed = entries.filter((entry) => entry.isError);
  const failedSymbols = failed.map((entry) => entry.ticker.symbol).join(', ');
  const series = entries
    .filter((entry) => !entry.isError)
    .map((entry) => ({
      symbol: entry.ticker.symbol,
      points: toPercentSeries(entry.data),
      colorVar: colorVarForIndex(entry.index),
    }))
    .filter((item) => item.points.length > 0);

  if (series.length === 0) {
    return (
      <ChartSection>
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>Não foi possível carregar as cotações.</AlertTitle>
          <AlertDescription>Tente novamente em instantes.</AlertDescription>
        </Alert>
      </ChartSection>
    );
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

  return (
    <ChartSection
      description={`${rows.length} pregões · variação % desde o início do período`}
    >
      {failed.length > 0 && (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Alguns ativos não carregaram.</AlertTitle>
          <AlertDescription>{failedSymbols}</AlertDescription>
        </Alert>
      )}

      <ChartContainer
        config={config}
        className="aspect-auto h-[360px] w-full lg:h-[460px] xl:h-[560px]"
      >
        <LineChart
          accessibilityLayer
          data={rows}
          margin={{ left: 4, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <ReferenceLine y={0} strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={40}
            tickFormatter={formatDateTick}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={48}
            padding={{ top: 8, bottom: 8 }}
            tickFormatter={formatPercentTick}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  formatDateTick(payload?.[0]?.payload.date)
                }
                formatter={(value, name) => (
                  <ChartTooltipRow
                    symbol={String(name)}
                    changePct={Number(value)}
                  />
                )}
              />
            }
          />
          {series.map((item) => (
            <Line
              key={item.symbol}
              dataKey={item.symbol}
              type="monotone"
              stroke={`var(--color-${item.symbol})`}
              strokeWidth={2}
              dot={{
                r: 3,
                fill: 'var(--background)',
                stroke: `var(--color-${item.symbol})`,
                strokeWidth: 2,
              }}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartContainer>

      <TickerSummaryList items={summaries} />
    </ChartSection>
  );
}
