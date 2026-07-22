import { formatChangePct } from '@/lib/series';

interface ChartTooltipRowProps {
  symbol: string;
  changePct: number;
}

export function ChartTooltipRow({ symbol, changePct }: ChartTooltipRowProps) {
  return (
    <>
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
        style={{ backgroundColor: `var(--color-${symbol})` }}
      />
      <div className="flex flex-1 items-center justify-between gap-2 leading-none">
        <span className="text-muted-foreground">{symbol}</span>
        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatChangePct(changePct)}
        </span>
      </div>
    </>
  );
}
