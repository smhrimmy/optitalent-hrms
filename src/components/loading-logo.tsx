'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LoadingLogo({ className, label = 'Opening your people file' }: { className?: string; label?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={cn('flex flex-col items-center justify-center gap-5', className)} role="status" aria-live="polite">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="72"
        height="72"
        viewBox="0 0 72 72"
        className="text-primary"
        initial={reduce ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="8" y="10" width="56" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <motion.circle
          cx="36"
          cy="36"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="88"
          initial={reduce ? false : { strokeDashoffset: 88 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
        />
        <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          OT
        </text>
      </motion.svg>
      <p className="font-headline text-xl text-foreground">OptiTalent</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
