import { format } from 'date-fns';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartTooltipRow } from '@/components/ticker/chart/ChartTooltipRow';
import { PartialFailureAlert } from '@/components/ticker/chart/PartialFailureAlert';
import { TickerSummaryList } from '@/components/ticker/chart/TickerSummaryList';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface PriceChartCanvasProps {
  rows: Record<string, number>[];
  config: ChartConfig;
  series: { symbol: string }[];
  summaries: { symbol: string; changePct: number; colorVar: string }[];
  failureLines: string[];
}

function formatDateTick(value: number): string {
  return format(new Date(value * 1000), 'dd/MM');
}

function formatPercentTick(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`;
}

export function PriceChartCanvas({
  rows,
  config,
  series,
  summaries,
  failureLines,
}: PriceChartCanvasProps) {
  return (
    <>
      {failureLines.length > 0 && <PartialFailureAlert lines={failureLines} />}

      <ChartContainer
        config={config}
        className="aspect-auto h-[40vh] max-h-[520px] min-h-[220px] w-full md:h-[50vh]"
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
    </>
  );
}
