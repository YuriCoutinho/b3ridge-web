import type { Ticker } from '@b3ridge/contracts';
import type { BrapiPage } from '../clients/brapi.js';

export function mergeTickers(pages: BrapiPage[]): Ticker[] {
  const bySymbol = new Map<string, Ticker>();
  let totalItems = 0;

  for (const page of pages) {
    totalItems = Math.max(totalItems, page.pagination.totalItems);

    for (const raw of page.results) {
      if (bySymbol.has(raw.symbol)) continue;

      bySymbol.set(raw.symbol, {
        symbol: raw.symbol,
        name: raw.name !== raw.symbol ? raw.name : (raw.longName ?? raw.symbol),
      });
    }
  }

  const tickers = [...bySymbol.values()];
  if (tickers.length < totalItems) {
    console.warn(
      `tickers list incomplete: received ${tickers.length} of ${totalItems}`,
    );
  }

  return tickers;
}
