'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultOrg, readOrg, writeOrg, type OrgConfig, formatMoney } from '@/lib/org-config';
import { toast } from 'sonner';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { appendAudit } from '@/lib/audit';
import { useAuth } from '@/hooks/use-auth';

export default function AdminSettingsPage() {
  const params = useParams();
  const role = params.role as string;
  const { user } = useAuth();
  const [org, setOrg] = useState<OrgConfig>(defaultOrg);

  useEffect(() => setOrg(readOrg()), []);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Configuration</h1>
        <p className="text-muted-foreground">Organization defaults for money and time. Module flags live under Feature Config.</p>
      </div>
      <form
        className="space-y-4 border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          writeOrg(org);
          appendAudit(user?.email || 'demo', 'org.update', org.currency);
          toast.success('Organization defaults saved on this device.');
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="name">Company name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currency">Currency code</Label>
          <Input id="currency" value={org.currency} onChange={(e) => setOrg({ ...org, currency: e.target.value.toUpperCase() })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="locale">Locale</Label>
          <Input id="locale" value={org.locale} onChange={(e) => setOrg({ ...org, locale: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tz">Timezone</Label>
          <Input id="tz" value={org.timezone} onChange={(e) => setOrg({ ...org, timezone: e.target.value })} />
        </div>
        <p className="text-sm text-muted-foreground">Preview: {formatMoney(1284.5, org)}</p>
        <Button type="submit">Save organization</Button>
      </form>
      <nav className="grid gap-2 text-sm">
        <Link className="underline" href={`/${role}/admin-config`}>Modules / feature flags</Link>
        <Link className="underline" href={`/${role}/super-admin/security`}>Security</Link>
        <Link className="underline" href={`/${role}/audit`}>Audit</Link>
        <Link className="underline" href={`/${role}/workflows`}>Workflow sketches</Link>
        <Link className="underline" href={`/${role}/settings`}>My account</Link>
      </nav>
    </div>
  );
}
