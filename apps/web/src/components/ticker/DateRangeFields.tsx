import { useEffect, useId, useState } from 'react';
import { format, parse, isValid, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, InfoIcon } from 'lucide-react';
import type { Matcher } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import {
  dataLagDays,
  dateToIso,
  isoToDate,
  maxEndDateIso,
  type DateRange,
  type RangeErrors,
} from '@/lib/dateRange';

const displayFormat = 'dd/MM/yyyy';

function formatDisplay(iso: string): string {
  const date = isoToDate(iso);
  return date ? format(date, displayFormat) : '';
}

function parseDisplay(text: string): string | null {
  const parsed = parse(text, displayFormat, new Date());
  return isValid(parsed) ? dateToIso(parsed) : null;
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  error: string | null;
  disabled?: boolean;
  disabledDays: Matcher | Matcher[];
  defaultMonth: Date;
  hint?: string;
}

function DateField({
  label,
  value,
  onChange,
  error,
  disabled,
  disabledDays,
  defaultMonth,
  hint,
}: DateFieldProps) {
  const inputId = useId();
  const errorId = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => formatDisplay(value));

  useEffect(() => {
    setText(formatDisplay(value));
  }, [value]);

  const selectedDate = isoToDate(value);
  const isInvalid = Boolean(error);

  function handleTextChange(next: string) {
    setText(next);
    const iso = parseDisplay(next);
    if (iso) {
      onChange(iso);
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
        {hint && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={hint}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                />
              }
            >
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <InputGroup>
        <InputGroupInput
          id={inputId}
          value={text}
          disabled={disabled}
          placeholder="dd/mm/aaaa"
          inputMode="numeric"
          className="text-sm"
          aria-invalid={isInvalid || undefined}
          aria-describedby={isInvalid ? errorId : undefined}
          onChange={(event) => handleTextChange(event.target.value)}
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
                />
              }
            >
              <CalendarIcon />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={selectedDate}
                defaultMonth={selectedDate ?? defaultMonth}
                disabled={disabledDays}
                onSelect={handleCalendarSelect}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {isInvalid && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface DateRangeFieldsProps {
  range: DateRange;
  onChangeRange: (next: DateRange) => void;
  errors: RangeErrors;
  disabled?: boolean;
}

export function DateRangeFields({
  range,
  onChangeRange,
  errors,
  disabled,
}: DateRangeFieldsProps) {
  const maxEndDate = isoToDate(maxEndDateIso())!;
  const startDate = isoToDate(range.startDate);
  const endDate = isoToDate(range.endDate);

  const startDisabledDays: Matcher = {
    after: endDate ? subDays(endDate, 1) : maxEndDate,
  };
  const endDisabledDays: Matcher[] = [
    { after: maxEndDate },
    ...(startDate ? [{ before: addDays(startDate, 1) }] : []),
  ];

  return (
    <div className="flex gap-3 max-[442px]:w-full">
      <DateField
        label="Início"
        value={range.startDate}
        onChange={(startDate) => onChangeRange({ ...range, startDate })}
        error={errors.startError}
        disabled={disabled}
        disabledDays={startDisabledDays}
        defaultMonth={maxEndDate}
      />
      <DateField
        label="Fim"
        value={range.endDate}
        onChange={(endDate) => onChangeRange({ ...range, endDate })}
        error={errors.endError}
        disabled={disabled}
        disabledDays={endDisabledDays}
        defaultMonth={maxEndDate}
        hint={`Cotações com defasagem de até ${dataLagDays} dias.`}
      />
    </div>
  );
}
