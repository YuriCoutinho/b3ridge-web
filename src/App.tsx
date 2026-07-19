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
