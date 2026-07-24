import { ptBR } from 'date-fns/locale';
import type { Matcher } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';

interface DateFieldCalendarProps {
  selected: Date | undefined;
  defaultMonth: Date;
  disabledDays: Matcher | Matcher[];
  onSelect: (date: Date | undefined) => void;
}

export function DateFieldCalendar({
  selected,
  defaultMonth,
  disabledDays,
  onSelect,
}: DateFieldCalendarProps) {
  return (
    <Calendar
      mode="single"
      locale={ptBR}
      selected={selected}
      defaultMonth={defaultMonth}
      disabled={disabledDays}
      onSelect={onSelect}
      autoFocus
    />
  );
}
