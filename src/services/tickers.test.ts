import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchTickers, fetchTickerHistory } from '@/services/tickers';

function stubFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, status, json: async () => body }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchTickers', () => {
  it('retorna apenas symbol e name, descartando o resto do payload', async () => {
    stubFetch({
      results: [
        { symbol: 'PETR4', name: 'Petrobras', quote: {}, sector: 'x' },
        { symbol: 'VALE3', name: 'Vale', quote: {}, sector: 'y' },
      ],
    });

    const result = await fetchTickers();

    expect(result).toEqual([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'VALE3', name: 'Vale' },
    ]);
  });

  it('lança erro quando a resposta não é ok', async () => {
    stubFetch({}, false, 500);

    await expect(fetchTickers()).rejects.toThrow();
  });
});

describe('fetchTickerHistory', () => {
  it('retorna os pontos de historicalDataPrice', async () => {
    const point = {
      date: 1,
      open: 1,
      high: 2,
      low: 0,
      close: 1.5,
      volume: 100,
      adjustedClose: 1.5,
    };
    stubFetch({ results: [{ data: { historicalDataPrice: [point] } }] });

    const result = await fetchTickerHistory('PETR4');

    expect(result).toEqual([point]);
  });

  it('retorna lista vazia quando results vem vazio', async () => {
    stubFetch({ results: [] });

    const result = await fetchTickerHistory('XXXX');

    expect(result).toEqual([]);
  });
});
