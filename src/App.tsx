import { TickerSelect } from '@/components/TickerSelect';
import { HistoryPreview } from '@/components/HistoryPreview';
import { TickerHistoryProvider } from '@/context/TickerHistoryProvider';

function App() {
  return (
    <TickerHistoryProvider>
      <TickerSelect />
      <HistoryPreview />
    </TickerHistoryProvider>
  );
}

export default App;
