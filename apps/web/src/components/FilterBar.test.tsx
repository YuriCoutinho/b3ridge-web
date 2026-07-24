import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FilterBar } from '@/components/FilterBar';
import { resolveRange } from '@/lib/dateRange';
import type { Ticker } from '@/services/tickers';

const petr4: Ticker = { symbol: 'PETR4', name: 'Petrobras' };

vi.mock('@/components/ticker/selector/TickerSelector', () => ({
  TickerSelector: ({
    onSelectionChange,
  }: {
    onSelectionChange: (tickers: Ticker[]) => void;
  }) => (
    <button type="button" onClick={() => onSelectionChange([petr4])}>
      select-petr4
    </button>
  ),
}));

vi.mock('@/components/ticker/date-range/RangePresets', () => ({
  RangePresets: () => null,
}));

vi.mock('@/components/ticker/date-range/DateRangeFields', () => ({
  DateRangeFields: () => null,
}));

describe('FilterBar', () => {
  it('applies the current selection with the default range on submit', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(<FilterBar onApply={onApply} />);

    await user.click(screen.getByText('select-petr4'));
    await user.click(screen.getByRole('button', { name: 'Consultar' }));

    expect(onApply).toHaveBeenCalledWith([petr4], resolveRange('5d'));
  });

  it('does not apply while nothing is selected', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(<FilterBar onApply={onApply} />);

    const submit = screen.getByRole('button', { name: 'Consultar' });
    expect(submit).toBeDisabled();

    await user.click(submit);
    expect(onApply).not.toHaveBeenCalled();
  });
});
