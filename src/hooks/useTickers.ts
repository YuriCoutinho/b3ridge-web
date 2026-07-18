import { useEffect, useState } from 'react';
import { fetchTickers, type Ticker } from '@/services/tickers';

type Status = 'loading' | 'ready' | 'error';

export function useTickers() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    async function loadTickers() {
      try {
        const data = await fetchTickers();
        setTickers(data);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }

    loadTickers();
  }, []);

  return { tickers, status };
}
