'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const KEY = 'optitalent_cookie_ok';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!localStorage.getItem(KEY));
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-lg border bg-card p-4 shadow-lg md:left-auto"
    >
      <p className="text-sm">
        We store a session cookie and local HR demo data on this device. Analytics stay off until you opt in.{' '}
        <Link href="/cookies" className="underline">
          Cookie policy
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem(KEY, 'accepted');
            setShow(false);
          }}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            localStorage.setItem(KEY, 'necessary');
            setShow(false);
          }}
        >
          Necessary only
        </Button>
      </div>
    </div>
  );
}
