'use client';

import { BrandLoader } from '@/components/brand-loader';

export function PendingOverlay({
  show,
  label = 'Working…',
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;
  return <BrandLoader label={label} />;
}
