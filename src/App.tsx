import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { TickerSelector } from '@/components/TickerSelector';
import { RangePresets } from '@/components/ticker/RangePresets';
import { DateRangeFields } from '@/components/ticker/DateRangeFields';
import { HistoryPreview } from '@/components/ticker/HistoryPreview';
import { useTickerSelection } from '@/hooks/useTickerSelection';
import { useDateRange } from '@/hooks/useDateRange';
import { todayIso, validateRange } from '@/lib/dateRange';

function App() {
  const { selected, setSelected } = useTickerSelection();
  const { range, activePreset, applyPreset, changeRange } = useDateRange();

  const hasSelection = selected.length > 0;
  const rangeErrors = validateRange(range, todayIso());

  return (
    <>
      <Header />

      <FilterBar>
        <TickerSelector selected={selected} onSelectionChange={setSelected} />
        <RangePresets
          value={activePreset}
          onSelectPreset={applyPreset}
          disabled={!hasSelection}
        />
        <DateRangeFields
          range={range}
          onChangeRange={changeRange}
          errors={rangeErrors}
          disabled={!hasSelection}
        />
      </FilterBar>

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <HistoryPreview selected={selected} range={range} />
      </main>

      <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
        Dados via <span className="font-medium text-foreground">brapi.dev</span>{' '}
        · preview simulado
      </footer>
    </>
  );
}

export default App;
