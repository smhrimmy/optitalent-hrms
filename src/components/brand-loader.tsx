'use client';

import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLoader({
  className,
  label = 'Loading',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn('ot-brand-loader', className)} role="status" aria-live="polite" aria-label={label}>
      <div className="ot-brand-logo-wrap">
        <Layers className="ot-brand-logo-blur" aria-hidden />
        <Layers className="ot-brand-logo" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function LoadingLogo({ className }: { className?: string }) {
  return <BrandLoader className={className} />;
}
