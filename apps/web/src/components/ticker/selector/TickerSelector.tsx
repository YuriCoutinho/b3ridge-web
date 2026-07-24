import { maxBatchSymbols } from '@b3ridge/contracts';
import { useId } from 'react';

import { SelectedTickerChips } from '@/components/ticker/selector/SelectedTickerChips';
import { TickerListPlaceholder } from '@/components/ticker/selector/TickerListPlaceholder';
import { TickerOption } from '@/components/ticker/selector/TickerOption';
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { useTickers } from '@/hooks/useTickers';
import { matchTicker, sameSymbol } from '@/lib/ticker';
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
    selected.some((item) => sameSymbol(item, ticker));

  return (
    <div className="flex w-full max-w-60 flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Ativos
      </label>

      <Combobox
        multiple
        items={tickers}
        value={selected}
        onValueChange={onSelectionChange}
        itemToStringLabel={(ticker) => ticker.symbol}
        filter={matchTicker}
        isItemEqualToValue={sameSymbol}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: Ticker[]) => (
              <>
                <SelectedTickerChips
                  values={values}
                  maxVisible={MAX_VISIBLE_CHIPS}
                />
                <ComboboxChipsInput
                  id={inputId}
                  disabled={isPending}
                  placeholder={hasSelection ? '' : 'Selecione um ativo'}
                  className="min-w-1"
                />
              </>
            )}
          </ComboboxValue>

          <ComboboxTrigger
            className="ml-auto self-center text-muted-foreground"
            onMouseDown={(event) => event.preventDefault()}
          />
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>
            <TickerListPlaceholder
              isError={isError}
              isPending={isPending}
              onRetry={() => refetch()}
            />
          </ComboboxEmpty>

          <ComboboxList>
            {(ticker: Ticker) => (
              <TickerOption
                key={ticker.symbol}
                ticker={ticker}
                disabled={atLimit && !isSelected(ticker)}
              />
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
