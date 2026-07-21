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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { TickerSummaryList } from '@/components/ticker/TickerSummaryList';
import { useTickerHistories } from '@/hooks/useTickerHistories';
import { isValidRange, todayIso, type DateRange } from '@/lib/dateRange';
import {
  buildChartRows,
  colorVarForIndex,
  isDashedForIndex,
  lastChangePct,
  toPercentSeries,
} from '@/lib/series';
import type { Ticker } from '@/services/tickers';

interface PriceChartProps {
  selected: Ticker[];
  range: DateRange;
}

function ChartCard({
  description,
  children,
}: {
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Preços</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
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
      <ChartCard>
        <p className="text-sm text-muted-foreground">
          Nenhum ativo selecionado.
        </p>
      </ChartCard>
    );
  }

  if (!isValidRange(range, todayIso())) {
    return (
      <ChartCard>
        <p className="text-sm text-muted-foreground">
          Ajuste o período para consultar as cotações.
        </p>
      </ChartCard>
    );
  }

  const entries = selected.map((ticker, index) => ({
    ticker,
    index,
    ...histories[ticker.symbol],
  }));

  if (entries.some((entry) => entry.isPending)) {
    return (
      <ChartCard>
        <Skeleton className="aspect-auto h-[320px] w-full" />
        <div className="flex flex-wrap gap-2">
          {selected.map((ticker) => (
            <Skeleton key={ticker.symbol} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </ChartCard>
    );
  }

  const failed = entries.filter((entry) => entry.isError);
  const series = entries
    .filter((entry) => !entry.isError)
    .map((entry) => {
      const points = toPercentSeries(entry.data);
      return {
        symbol: entry.ticker.symbol,
        points,
        changePct: lastChangePct(points),
        colorVar: colorVarForIndex(entry.index),
        dashed: isDashedForIndex(entry.index),
      };
    })
    .filter((item) => item.points.length > 0);

  if (series.length === 0) {
    return (
      <ChartCard>
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>Não foi possível carregar as cotações.</AlertTitle>
          <AlertDescription>
            {failed.map((entry) => (
              <span key={entry.ticker.symbol}>
                {entry.ticker.symbol}:{' '}
                {entry.error?.message ?? 'falha desconhecida'}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      </ChartCard>
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
    changePct: item.changePct,
    colorVar: item.colorVar,
  }));

  return (
    <ChartCard
      description={`${rows.length} pregões · variação % desde o início do período`}
    >
      {failed.length > 0 && (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Alguns ativos não carregaram.</AlertTitle>
          <AlertDescription>
            {failed.map((entry) => (
              <span key={entry.ticker.symbol}>
                {entry.ticker.symbol}:{' '}
                {entry.error?.message ?? 'falha desconhecida'}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <ChartContainer config={config} className="aspect-auto h-[320px] w-full">
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
            tickFormatter={formatPercentTick}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  formatDateTick(payload?.[0]?.payload.date)
                }
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
              strokeDasharray={item.dashed ? '6 4' : undefined}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartContainer>

      <TickerSummaryList items={summaries} />
    </ChartCard>
  );
}
