import { useQuery } from '@tanstack/react-query';

import { fetchTickers } from '@/services/tickers';

export function useTickers() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['tickers', 'list'],
    queryFn: fetchTickers,
  });

  return { tickers: data ?? [], isPending, isError, refetch };
}
