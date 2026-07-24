import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DateRangeFields } from '@/components/ticker/date-range/DateRangeFields';

const range = { startDate: '2026-07-14', endDate: '2026-07-19' };
const noErrors = { startError: null, endError: null };

describe('DateRangeFields', () => {
  it('renders the ISO range as day-first formatted text', () => {
    render(
      <DateRangeFields
        range={range}
        onChangeRange={vi.fn()}
        errors={noErrors}
      />,
    );

    expect(screen.getByLabelText('Início')).toHaveValue('14/07/2026');
    expect(screen.getByLabelText('Fim')).toHaveValue('19/07/2026');
  });

  it('commits a fully typed date back as ISO', async () => {
    const user = userEvent.setup();
    const onChangeRange = vi.fn();

    render(
      <DateRangeFields
        range={range}
        onChangeRange={onChangeRange}
        errors={noErrors}
      />,
    );

    const start = screen.getByLabelText('Início');
    await user.clear(start);
    await user.type(start, '10/07/2026');

    expect(onChangeRange).toHaveBeenLastCalledWith({
      startDate: '2026-07-10',
      endDate: '2026-07-19',
    });
  });

  it('does not commit an incomplete date', async () => {
    const user = userEvent.setup();
    const onChangeRange = vi.fn();

    render(
      <DateRangeFields
        range={range}
        onChangeRange={onChangeRange}
        errors={noErrors}
      />,
    );

    const start = screen.getByLabelText('Início');
    await user.clear(start);
    await user.type(start, '10/07');

    expect(onChangeRange).not.toHaveBeenCalled();
  });

  it('shows the inline error message for the affected field', () => {
    render(
      <DateRangeFields
        range={range}
        onChangeRange={vi.fn()}
        errors={{
          startError: null,
          endError: 'A data final deve ser no máximo ontem.',
        }}
      />,
    );

    expect(
      screen.getByText('A data final deve ser no máximo ontem.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Fim')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('toggles the hint tooltip on click and hides it on blur', async () => {
    const user = userEvent.setup();

    render(
      <DateRangeFields
        range={range}
        onChangeRange={vi.fn()}
        errors={noErrors}
      />,
    );

    const hint = /Cotações com defasagem/;
    const trigger = screen.getByRole('button', { name: hint });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent(hint);

    await user.click(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
