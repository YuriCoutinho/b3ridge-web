import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { TickerSelector } from '@/components/TickerSelector';
import { RangePresets } from '@/components/ticker/RangePresets';
import { DateRangeFields } from '@/components/ticker/DateRangeFields';
import { PriceChart } from '@/components/ticker/PriceChart';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTickerSelection } from '@/hooks/useTickerSelection';
import { useTickerSubmission } from '@/hooks/useTickerSubmission';
import { useDateRange } from '@/hooks/useDateRange';
import { isValidRange, maxEndDateIso, validateRange } from '@/lib/dateRange';

function App() {
  const { selected, setSelected } = useTickerSelection();
  const { range, activePreset, applyPreset, changeRange } = useDateRange();
  const { submission, submit } = useTickerSubmission();

  const hasSelection = selected.length > 0;
  const rangeErrors = validateRange(range, maxEndDateIso());
  const canSubmit = hasSelection && isValidRange(range, maxEndDateIso());

  return (
    <TooltipProvider>
      <Header />

      <FilterBar onSubmit={() => canSubmit && submit(selected, range)}>
        <TickerSelector selected={selected} onSelectionChange={setSelected} />
        <RangePresets
          value={activePreset}
          onSelectPreset={applyPreset}
          disabled={!hasSelection}
        />
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4 max-[442px]:w-full">
          <DateRangeFields
            range={range}
            onChangeRange={changeRange}
            errors={rangeErrors}
            disabled={!hasSelection}
          />
          <Button
            type="submit"
            disabled={!canSubmit}
            className="max-[442px]:h-10 max-[442px]:w-full"
          >
            Consultar
          </Button>
        </div>
      </FilterBar>

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <PriceChart
          selected={submission?.tickers ?? []}
          range={submission?.range ?? range}
        />
      </main>

      <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
        Dados via <span className="font-medium text-foreground">brapi.dev</span>{' '}
        · preview simulado
      </footer>
    </TooltipProvider>
  );
}

export default App;
