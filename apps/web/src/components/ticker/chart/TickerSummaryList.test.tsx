import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TickerSummaryList } from '@/components/ticker/chart/TickerSummaryList';

describe('TickerSummaryList', () => {
  const items = [
    { symbol: 'PETR4', changePct: 5.62, colorVar: 'var(--chart-1)' },
    { symbol: 'VALE3', changePct: -4, colorVar: 'var(--chart-2)' },
  ];

  it('renders one chip per ticker in the given order', () => {
    render(<TickerSummaryList items={items} />);

    const chips = screen.getAllByRole('listitem');
    expect(
      chips.map((chip) => within(chip).getByText(/^[A-Z]+\d+$/).textContent),
    ).toEqual(['PETR4', 'VALE3']);
  });

  it('signs the change and colors gains and losses differently', () => {
    render(<TickerSummaryList items={items} />);

    expect(screen.getByText('+5.62%')).toHaveClass('text-success');
    expect(screen.getByText('-4.00%')).toHaveClass('text-destructive');
  });

  it('paints each dot with the same color used in the chart', () => {
    const { container } = render(<TickerSummaryList items={items} />);
    const dots = container.querySelectorAll('span[aria-hidden="true"]');

    expect(dots[0]).toHaveStyle({ backgroundColor: 'var(--chart-1)' });
    expect(dots[1]).toHaveStyle({ backgroundColor: 'var(--chart-2)' });
  });
});
