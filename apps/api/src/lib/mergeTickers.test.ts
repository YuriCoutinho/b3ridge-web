import { describe, it, expect } from 'vitest';
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

function page(results: BrapiTicker[]): BrapiPage {
  return { results, pagination: { totalItems: results.length } };
}

describe('mergeTickers', () => {
  it('concatenates pages in order and projects to symbol and name', () => {
    const pages = [
      page([
        ticker({ symbol: 'PETR4', name: 'Petrobras' }),
        ticker({ symbol: 'VALE3', name: 'Vale' }),
      ]),
      page([
        ticker({ symbol: 'HGLG11', name: 'CSHG Log' }),
        ticker({ symbol: 'AAPL34', name: 'AAPL34', longName: 'Apple Inc' }),
      ]),
    ];

    expect(mergeTickers(pages)).toEqual([
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'VALE3', name: 'Vale' },
      { symbol: 'HGLG11', name: 'CSHG Log' },
      { symbol: 'AAPL34', name: 'Apple Inc' },
    ]);
  });

  it('falls back to longName when name only repeats the symbol', () => {
    const pages = [
      page([
        ticker({
          symbol: 'KIVO11',
          name: 'KIVO11',
          longName: 'Kilima Volkano FII',
        }),
      ]),
    ];

    expect(mergeTickers(pages)[0].name).toBe('Kilima Volkano FII');
  });

  it('falls back to the symbol when neither name nor longName is usable', () => {
    const pages = [
      page([ticker({ symbol: 'XPTO3', name: 'XPTO3', longName: null })]),
    ];

    expect(mergeTickers(pages)[0].name).toBe('XPTO3');
  });
});
