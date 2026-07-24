import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { lazy, Suspense, useEffect, useId, useState } from 'react';
import type { Matcher } from 'react-day-picker';

import { InfoHint } from '@/components/ticker/date-range/InfoHint';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { dateToIso, isoToDate, maskDateInput } from '@/lib/dateRange';

const preloadCalendar = () =>
  import('@/components/ticker/date-range/DateFieldCalendar');

const DateFieldCalendar = lazy(() =>
  preloadCalendar().then((module) => ({ default: module.DateFieldCalendar })),
);

const displayFormat = 'dd/MM/yyyy';

function formatDisplay(iso: string): string {
  const date = isoToDate(iso);
  return date ? format(date, displayFormat) : '';
}

function parseDisplay(text: string): string | null {
  if (text.length !== displayFormat.length) {
    return null;
  }
  const parsed = parse(text, displayFormat, new Date());
  const roundTrips = isValid(parsed) && format(parsed, displayFormat) === text;
  return roundTrips ? dateToIso(parsed) : null;
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  invalid: boolean;
  errorId: string;
  disabled?: boolean;
  disabledDays: Matcher | Matcher[];
  defaultMonth: Date;
  hint?: string;
}

export function DateField({
  label,
  value,
  onChange,
  invalid,
  errorId,
  disabled,
  disabledDays,
  defaultMonth,
  hint,
}: DateFieldProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => formatDisplay(value));

  useEffect(() => {
    setText(formatDisplay(value));
  }, [value]);

  const selectedDate = isoToDate(value);

  function handleTextChange(next: string) {
    const masked = maskDateInput(next);
    setText(masked);
    const iso = parseDisplay(masked);
    if (iso) {
      onChange(iso);
    }
  }

  function handleBlur() {
    if (!parseDisplay(text)) {
      setText(formatDisplay(value));
    }
  }

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) {
      return;
    }
    onChange(dateToIso(date));
    setOpen(false);
  }

  return (
    <div className="flex w-36 flex-col gap-1.5 max-[442px]:w-auto max-[442px]:flex-1">
      <div className="flex items-center gap-1">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
        {hint && <InfoHint text={hint} />}
      </div>

      <InputGroup>
        <InputGroupInput
          id={inputId}
          value={text}
          disabled={disabled}
          placeholder="dd/mm/aaaa"
          inputMode="numeric"
          className="text-sm"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={handleBlur}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  variant="ghost"
                  disabled={disabled}
                  aria-label={`Abrir calendário de ${label.toLowerCase()}`}
                  onMouseEnter={preloadCalendar}
                  onFocus={preloadCalendar}
                />
              }
            >
              <CalendarIcon />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Suspense fallback={null}>
                <DateFieldCalendar
                  selected={selectedDate}
                  defaultMonth={selectedDate ?? defaultMonth}
                  disabledDays={disabledDays}
                  onSelect={handleCalendarSelect}
                />
              </Suspense>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
