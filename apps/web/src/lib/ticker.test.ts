import { describe, expect, it } from 'vitest';

import { matchTicker, sameSymbol } from '@/lib/ticker';
import type { Ticker } from '@/services/tickers';

const petr4: Ticker = { symbol: 'PETR4', name: 'Petróleo Brasileiro' };

describe('matchTicker', () => {
  it('matches by symbol case-insensitively', () => {
    expect(matchTicker(petr4, 'petr')).toBe(true);
  });

  it('matches by name', () => {
    expect(matchTicker(petr4, 'brasileiro')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(matchTicker(petr4, '  PETR4  ')).toBe(true);
  });

  it('returns false when neither symbol nor name contains the term', () => {
    expect(matchTicker(petr4, 'vale')).toBe(false);
  });
});

describe('sameSymbol', () => {
  it('compares tickers by symbol regardless of name', () => {
    expect(sameSymbol(petr4, { symbol: 'PETR4', name: 'Other' })).toBe(true);
    expect(sameSymbol(petr4, { symbol: 'VALE3', name: 'Vale' })).toBe(false);
  });
});
