import type { Ticker } from '@/services/tickers';

export function matchTicker(ticker: Ticker, query: string): boolean {
  const term = query.trim().toLowerCase();
  return (
    ticker.symbol.toLowerCase().includes(term) ||
    ticker.name.toLowerCase().includes(term)
  );
}

export function sameSymbol(a: Ticker, b: Ticker): boolean {
  return a.symbol === b.symbol;
}
