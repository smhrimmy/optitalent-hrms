'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MfaPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        className="w-full max-w-sm border bg-card p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim() !== '000000') {
            toast.error('Use demo code 000000. Hardware MFA is not enrolled.');
            return;
          }
          sessionStorage.setItem('ot_mfa_ok', '1');
          router.replace('/dashboard');
        }}
      >
        <h1 className="font-headline text-2xl">Confirm it is you</h1>
        <p className="text-sm text-muted-foreground">MFA is required by Security Center. Demo authenticator code is 000000.</p>
        <div className="space-y-1">
          <Label htmlFor="otp">One-time code</Label>
          <Input id="otp" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </main>
  );
}
