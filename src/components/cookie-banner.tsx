'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('ot_cookie_ok')) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t bg-card/95 p-4 shadow-lg backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies to keep you signed in. See the{' '}
          <Link href="/cookies" className="underline">
            cookie notice
          </Link>
          .
        </p>
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem('ot_cookie_ok', '1');
            setShow(false);
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
