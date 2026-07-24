import { useId } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { maxBatchSymbols } from '@b3ridge/contracts';
import { Button } from '@/components/ui/button';
import { useTickers } from '@/hooks/useTickers';
import type { Ticker } from '@/services/tickers';

const MAX_VISIBLE_CHIPS = 2;

interface TickerSelectorProps {
  selected: Ticker[];
  onSelectionChange: (tickers: Ticker[]) => void;
}

export function TickerSelector({
  selected,
  onSelectionChange,
}: TickerSelectorProps) {
  const inputId = useId();
  const anchor = useComboboxAnchor();
  const { tickers, isPending, isError, refetch } = useTickers();

  const hasSelection = selected.length > 0;
  const atLimit = selected.length >= maxBatchSymbols;
  const isSelected = (ticker: Ticker) =>
    selected.some((item) => item.symbol === ticker.symbol);

  return (
    <div className="flex w-full max-w-60 flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Ativos
      </label>

      <Combobox<Ticker, true>
        multiple
        items={tickers}
        value={selected}
        onValueChange={onSelectionChange}
        itemToStringLabel={(ticker) => ticker.symbol}
        filter={(ticker, query) => {
          const term = query.trim().toLowerCase();
          return (
            ticker.symbol.toLowerCase().includes(term) ||
            ticker.name.toLowerCase().includes(term)
          );
        }}
        isItemEqualToValue={(ticker, selectedTicker) =>
          ticker.symbol === selectedTicker.symbol
        }
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: Ticker[]) => {
              const visible = values.slice(0, MAX_VISIBLE_CHIPS);
              const overflow = values.length - visible.length;

              return (
                <>
                  {visible.map((ticker) => (
                    <ComboboxChip key={ticker.symbol}>
                      {ticker.symbol}
                    </ComboboxChip>
                  ))}
                  {overflow > 0 && (
                    <span className="flex h-[calc(--spacing(5.25))] items-center rounded-sm bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                      +{overflow}
                    </span>
                  )}
                  <ComboboxChipsInput
                    id={inputId}
                    disabled={isPending}
                    placeholder={hasSelection ? '' : 'Selecione um ativo'}
                    className="min-w-1"
                  />
                </>
              );
            }}
          </ComboboxValue>
          <ComboboxTrigger
            className="ml-auto self-center text-muted-foreground"
            onMouseDown={(event) => event.preventDefault()}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>
            {isError ? (
              <div className="flex flex-col items-center gap-1.5">
                Não foi possível carregar os ativos.
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </div>
            ) : isPending ? (
              'Carregando ativos…'
            ) : (
              'Nenhum ativo encontrado.'
            )}
          </ComboboxEmpty>
          <ComboboxList>
            {(ticker: Ticker) => (
              <ComboboxItem
                key={ticker.symbol}
                value={ticker}
                disabled={atLimit && !isSelected(ticker)}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {ticker.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ticker.name}
                  </span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {atLimit && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxBatchSymbols} ativos.
        </p>
      )}
    </div>
  );
}
