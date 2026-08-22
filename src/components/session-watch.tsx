'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function SessionWatch() {
  const [expired, setExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onExpired = () => setExpired(true);
    window.addEventListener('ot-session-expired', onExpired);
    return () => window.removeEventListener('ot-session-expired', onExpired);
  }, []);

  if (!expired) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4">
      <div className="max-w-md border bg-card p-6 space-y-4">
        <h2 className="font-headline text-xl">Your session has expired</h2>
        <p className="text-sm text-muted-foreground">
          Sign in again to keep working. Unsaved fields on this tab were not sent to the server.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/login')}>Sign in again</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Return to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
