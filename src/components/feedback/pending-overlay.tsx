'use client';

import { Loader2 } from 'lucide-react';
import { LoadingLogo } from '@/components/loading-logo';

export function PendingOverlay({
  show,
  label = 'Working…',
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;

  return (
    <div className="ot-pending-overlay" role="status" aria-live="polite">
      <div className="ot-pending-card">
        <LoadingLogo />
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {label}
        </p>
      </div>
    </div>
  );
}
