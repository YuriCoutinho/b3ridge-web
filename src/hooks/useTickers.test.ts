import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTickers } from '@/hooks/useTickers';
import { fetchTickers } from '@/services/tickers';

vi.mock('@/services/tickers');

afterEach(() => {
  vi.resetAllMocks();
});

describe('useTickers', () => {
  it('começa em loading, carrega os tickers e vai para ready', async () => {
    const data = [{ symbol: 'PETR4', name: 'Petrobras' }];
    vi.mocked(fetchTickers).mockResolvedValue(data);

    const { result } = renderHook(() => useTickers());

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.tickers).toEqual(data);
  });

  it('vai para error e mantém a lista vazia quando o fetch falha', async () => {
    vi.mocked(fetchTickers).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useTickers());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.tickers).toEqual([]);
  });
});
