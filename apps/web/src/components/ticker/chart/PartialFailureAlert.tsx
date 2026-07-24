import { TriangleAlertIcon } from 'lucide-react';

import { FailureLines } from '@/components/ticker/chart/FailureLines';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PartialFailureAlert({ lines }: { lines: string[] }) {
  return (
    <Alert>
      <TriangleAlertIcon />
      <AlertTitle>Alguns ativos não carregaram.</AlertTitle>
      <AlertDescription>
        <FailureLines lines={lines} />
      </AlertDescription>
    </Alert>
  );
}
