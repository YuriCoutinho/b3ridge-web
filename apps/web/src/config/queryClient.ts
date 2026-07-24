import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '../services/client';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      toast?: {
        success?: string;
        error?: string;
      };
    };
  }
}

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

const queryCache = new QueryCache({
  onError: (_error, query) => {
    const message = query.meta?.toast?.error;
    if (message) {
      toast.error(message);
    }
  },
  onSuccess: (_data, query) => {
    const message = query.meta?.toast?.success;
    if (message) {
      toast.success(message);
    }
  },
});

export const queryClient = new QueryClient({
  queryCache,
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
