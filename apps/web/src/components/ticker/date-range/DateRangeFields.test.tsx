import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DateRangeFields } from '@/components/ticker/date-range/DateRangeFields';

const range = { startDate: '2026-07-14', endDate: '2026-07-19' };
const noErrors = { startError: null, endError: null };

type FieldsProps = Partial<Parameters<typeof DateRangeFields>[0]>;

function renderFields(props: FieldsProps = {}) {
  return render(
    <DateRangeFields
      range={range}
      onChangeRange={vi.fn()}
      errors={noErrors}
      startErrorId="start-error"
      endErrorId="end-error"
      {...props}
    />,
  );
}

describe('DateRangeFields', () => {
  it('renders the ISO range as day-first formatted text', () => {
    renderFields();

    expect(screen.getByLabelText('Início')).toHaveValue('14/07/2026');
    expect(screen.getByLabelText('Fim')).toHaveValue('19/07/2026');
  });

  it('commits a fully typed date back as ISO', async () => {
    const user = userEvent.setup();
    const onChangeRange = vi.fn();

    renderFields({ onChangeRange });

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

    renderFields({ onChangeRange });

    const start = screen.getByLabelText('Início');
    await user.clear(start);
    await user.type(start, '10/07');

    expect(onChangeRange).not.toHaveBeenCalled();
  });

  it('masks non-digit input into the dd/mm/yyyy shape', async () => {
    const user = userEvent.setup();
    const onChangeRange = vi.fn();

    renderFields({ onChangeRange });

    const start = screen.getByLabelText('Início');
    await user.clear(start);
    await user.type(start, '01a07b2026');

    expect(start).toHaveValue('01/07/2026');
  });

  it('restores the last committed date on blur when the text is incomplete', async () => {
    const user = userEvent.setup();

    renderFields();

    const start = screen.getByLabelText('Início');
    await user.clear(start);
    await user.type(start, '10/07');
    await user.tab();

    expect(start).toHaveValue('14/07/2026');
  });

  it('marks the affected field as invalid and links it to the error message', () => {
    renderFields({
      errors: {
        startError: null,
        endError: 'A data final deve ser no máximo ontem.',
      },
    });

    const end = screen.getByLabelText('Fim');
    expect(end).toHaveAttribute('aria-invalid', 'true');
    expect(end).toHaveAttribute('aria-describedby', 'end-error');
    expect(screen.getByLabelText('Início')).not.toHaveAttribute('aria-invalid');
  });

  it('toggles the hint tooltip on click and hides it on blur', async () => {
    const user = userEvent.setup();

    renderFields();

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
