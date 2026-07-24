import { Skeleton } from '@/components/ui/skeleton';

export function ChartSkeleton({ symbols }: { symbols: string[] }) {
  return (
    <>
      <Skeleton className="aspect-auto h-[40vh] max-h-[520px] min-h-[220px] w-full md:h-[50vh]" />
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => (
          <Skeleton key={symbol} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    </>
  );
}
