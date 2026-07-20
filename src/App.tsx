import { TickerSelect } from '@/components/TickerSelect';
import { HistoryRangeControls } from '@/components/HistoryRangeControls';
import { HistoryPreview } from '@/components/HistoryPreview';
import { useTickerSelection } from '@/hooks/useTickerSelection';
import { useDateRange } from '@/hooks/useDateRange';

function App() {
  const { selected, setSelected } = useTickerSelection();
  const { range, activePreset, applyPreset, changeRange } = useDateRange();

  return (
    <>
      <header className="flex items-center gap-2.5 bg-navy-900 px-4 py-3 sm:px-6">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-navy-700">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-4 text-white"
          >
            <rect x="4" y="12" width="3.5" height="8" rx="1.5" />
            <rect x="10.25" y="6" width="3.5" height="14" rx="1.5" />
            <rect x="16.5" y="9" width="3.5" height="11" rx="1.5" />
          </svg>
        </span>
        <h1 className="text-base font-semibold text-white">B3ridge</h1>
        <span aria-hidden="true" className="hidden text-grey-500 sm:inline">
          ·
        </span>
        <span className="hidden text-sm text-grey-400 sm:inline">
          Market data bridge
        </span>
      </header>

      <TickerSelect selected={selected} onSelect={setSelected} />
      <HistoryRangeControls
        range={range}
        activePreset={activePreset}
        onApplyPreset={applyPreset}
        onChangeRange={changeRange}
      />
      <HistoryPreview selected={selected} range={range} />
    </>
  );
}

export default App;
