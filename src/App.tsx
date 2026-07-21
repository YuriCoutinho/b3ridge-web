import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TickerSelector } from '@/components/TickerSelector';
import { HistoryRangeControls } from '@/components/HistoryRangeControls';
import { HistoryPreview } from '@/components/HistoryPreview';
import { useTickerSelection } from '@/hooks/useTickerSelection';
import { useDateRange } from '@/hooks/useDateRange';

function App() {
  const { selected, setSelected } = useTickerSelection();
  const { range, activePreset, applyPreset, changeRange } = useDateRange();

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar>
          <TickerSelector selected={selected} onSelectionChange={setSelected} />
          <HistoryRangeControls
            range={range}
            activePreset={activePreset}
            onApplyPreset={applyPreset}
            onChangeRange={changeRange}
          />
        </Sidebar>

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <HistoryPreview selected={selected} range={range} />
        </main>
      </div>

      <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground md:hidden">
        Dados via <span className="font-medium text-foreground">brapi.dev</span>{' '}
        · preview simulado
      </footer>
    </>
  );
}

export default App;
