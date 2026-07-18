import { useTickerHistory } from '@/context/TickerHistoryContext';

// Placeholder do gráfico: só imprime os valores do histórico na tela.
// A estrutura de consumo do context fica pronta pro gráfico real substituir depois.
export function HistoryPreview() {
  const { selected, histories } = useTickerHistory();

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
