import type { Ticker } from '@/services/tickers';
import type { DateRange } from '@/lib/dateRange';
import { useTickerHistories } from '@/hooks/useTickerHistories';

interface HistoryPreviewProps {
  selected: Ticker[];
  range: DateRange;
}

export function HistoryPreview({ selected, range }: HistoryPreviewProps) {
  const histories = useTickerHistories(selected, range);

  if (selected.length === 0) {
    return <p>Nenhum ativo selecionado.</p>;
  }

  return (
    <ul>
      {selected.map((ticker) => {
        const points = histories[ticker.symbol];
        const last = points?.at(-1);

        return (
          <li key={ticker.symbol}>
            <strong>{ticker.symbol}</strong>{' '}
            {points
              ? `${points.length} pontos · último fechamento ${last?.close}`
              : 'carregando…'}
          </li>
        );
      })}
    </ul>
  );
}
