import { useEffect, useState } from 'react';
import { fetchTickers, type Ticker } from '@/services/tickers';

type Status = 'loading' | 'ready' | 'error';

export function useTickers() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    async function loadTickers() {
      try {
        const loadedTickers = await fetchTickers();
        setTickers(loadedTickers);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }

    loadTickers();
  }, []);

  return { tickers, status };
}
