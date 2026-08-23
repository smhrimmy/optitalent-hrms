'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorPageProps {
  code: string | number;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  title,
  description,
  actionLabel = "Back to home",
  actionHref = "/",
  onAction,
  secondaryActionLabel,
  secondaryHref,
  onSecondaryAction,
  className,
  children
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground", className)}>
      <div className="w-full max-w-lg space-y-6 border border-border bg-card p-8">
        <p className="font-code text-sm tracking-widest text-muted-foreground">{code}</p>
        <h1 className="font-headline text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        {children}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onAction ? (
            <Button onClick={onAction}>{actionLabel}</Button>
          ) : (
            <Button asChild><Link href={actionHref}>{actionLabel}</Link></Button>
          )}
          {secondaryActionLabel && (onSecondaryAction || secondaryHref) ? (
            onSecondaryAction ? (
              <Button variant="outline" onClick={onSecondaryAction}>{secondaryActionLabel}</Button>
            ) : (
              <Button variant="outline" asChild><Link href={secondaryHref!}>{secondaryActionLabel}</Link></Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
