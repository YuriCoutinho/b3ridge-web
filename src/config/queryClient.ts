import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../services/client';

const STALE_TIME = 1000 * 60 * 5;
const GC_TIME = 1000 * 60 * 30;
const MAX_RETRIES = 2;

function isClientError(error: Error): boolean {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

export function shouldRetry(failureCount: number, error: Error): boolean {
  if (isClientError(error)) {
    return false;
  }
  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: shouldRetry,
    },
  },
});
