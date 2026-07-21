import type { Ticker } from '@/services/tickers';
import { isValidRange, todayIso, type DateRange } from '@/lib/dateRange';
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

  if (!isValidRange(range, todayIso())) {
    return <p>Ajuste o período para consultar as cotações.</p>;
  }

  return (
    <ul>
      {selected.map((ticker) => {
        const { data, isPending } = histories[ticker.symbol];
        const last = data.at(-1);

        return (
          <li key={ticker.symbol}>
            <strong>{ticker.symbol}</strong>{' '}
            {isPending
              ? 'carregando…'
              : `${data.length} pontos${last ? ` · último fechamento ${last.close}` : ''}`}
          </li>
        );
      })}
    </ul>
  );
}
