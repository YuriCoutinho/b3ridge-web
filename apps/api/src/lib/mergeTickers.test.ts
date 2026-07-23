import { describe, it, expect, vi, afterEach } from 'vitest';
import type { BrapiPage, BrapiTicker } from '../clients/brapi.js';
import { mergeTickers } from './mergeTickers.js';

function ticker(
  overrides: Partial<BrapiTicker> & { symbol: string },
): BrapiTicker {
  return {
    name: overrides.symbol,
    longName: null,
    ...overrides,
  };
}

function page(results: BrapiTicker[], totalItems: number): BrapiPage {
  return { results, pagination: { totalItems } };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mergeTickers', () => {
  it('concatenates pages in order and projects to symbol and name', () => {
    const pages = [
      page(
        [
          ticker({ symbol: 'PETR4', name: 'Petrobras' }),
          ticker({ symbol: 'VALE3', name: 'Vale' }),
        ],
        4,
      ),
      page(
        [
          ticker({ symbol: 'HGLG11', name: 'CSHG Log' }),
          ticker({
            symbol: 'AAPL34',
            name: 'AAPL34',
            longName: 'Apple Inc',
          }),
        ],
        4,
      ),
    ];

    expect(mergeTickers(pages)).toEqual([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'VALE3', name: 'Vale' },
      { symbol: 'HGLG11', name: 'CSHG Log' },
      { symbol: 'AAPL34', name: 'Apple Inc' },
    ]);
  });

  it('keeps the first occurrence when a symbol straddles the page boundary', () => {
    const pages = [
      page(
        [ticker({ symbol: 'A' }), ticker({ symbol: 'DUP', name: 'first' })],
        3,
      ),
      page(
        [ticker({ symbol: 'DUP', name: 'second' }), ticker({ symbol: 'B' })],
        3,
      ),
    ];

    const result = mergeTickers(pages);

    expect(result.map((t) => t.symbol)).toEqual(['A', 'DUP', 'B']);
    expect(result.find((t) => t.symbol === 'DUP')?.name).toBe('first');
  });

  it('falls back to longName when name only repeats the symbol', () => {
    const pages = [
      page(
        [
          ticker({
            symbol: 'KIVO11',
            name: 'KIVO11',
            longName: 'Kilima Volkano FII',
          }),
        ],
        1,
      ),
    ];

    expect(mergeTickers(pages)[0].name).toBe('Kilima Volkano FII');
  });

  it('falls back to the symbol when neither name nor longName is usable', () => {
    const pages = [
      page([ticker({ symbol: 'XPTO3', name: 'XPTO3', longName: null })], 1),
    ];

    expect(mergeTickers(pages)[0].name).toBe('XPTO3');
  });

  it('warns when the merged list is smaller than the reported total', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mergeTickers([page([ticker({ symbol: 'ONLY1' })], 2302)]);

    expect(warn).toHaveBeenCalledWith(
      'tickers list incomplete: received 1 of 2302',
    );
  });
});
