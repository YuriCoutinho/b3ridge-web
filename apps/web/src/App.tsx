import { FilterBar } from '@/components/FilterBar';
import { Header } from '@/components/Header';
import { PriceChart } from '@/components/ticker/chart/PriceChart';
import { useTickerSubmission } from '@/hooks/useTickerSubmission';

function App() {
  const { tickers, range, submit } = useTickerSubmission();

  return (
    <>
      <Header />

      <FilterBar onApply={submit} />

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <PriceChart tickers={tickers} range={range} />
      </main>

      <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
        Dados via <span className="font-medium text-foreground">brapi.dev</span>{' '}
        · preview simulado
      </footer>
    </>
  );
}

export default App;
