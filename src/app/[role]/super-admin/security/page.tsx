'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Ban, Lock, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { appendAudit } from '@/lib/audit';
import { useAuth } from '@/hooks/use-auth';
import { defaultPolicy, readSecurity, writeSecurity, type SecurityPolicy } from '@/lib/security-policy';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WAF: { id: keyof SecurityPolicy['waf']; name: string; note: string }[] = [
  { id: 'sql', name: 'SQL injection intent', note: 'Logged here. Queries use the Supabase client, not string SQL.' },
  { id: 'xss', name: 'XSS intent', note: 'React escapes text. This switch does not install a WAF.' },
  { id: 'rfi', name: 'Remote file inclusion intent', note: 'Not enforced at the edge.' },
  { id: 'bots', name: 'Bot filter intent', note: 'No CAPTCHA is installed. Switch is a policy record only.' },
  { id: 'rate', name: 'App rate-limit intent', note: 'Middleware already caps HTML traffic per IP in-memory (not Redis).' },
];

export default function SecurityCenter() {
  const { user } = useAuth();
  const [policy, setPolicy] = useState<SecurityPolicy>(defaultPolicy);
  const [ipAddress, setIpAddress] = useState('');
  const [ready, setReady] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);

  useEffect(() => {
    setPolicy(readSecurity());
    setReady(true);
  }, []);

  const save = (next: SecurityPolicy, action: string, detail: string) => {
    setPolicy(next);
    writeSecurity(next);
    appendAudit(user?.email || 'demo', action, detail);
  };

  const handleBlockIp = () => {
    const ip = ipAddress.trim();
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
      toast.error('Enter an IPv4 address such as 203.0.113.10.');
      return;
    }
    const next = {
      ...policy,
      blockedIps: [{ ip, reason: 'Manual block (this browser)', date: new Date().toISOString() }, ...policy.blockedIps],
    };
    save(next, 'security.block_ip', ip);
    setIpAddress('');
    toast.success('IP stored on this device. Edge blocking is not connected.');
  };

  if (!ready) return <div className="h-40 animate-pulse bg-muted" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" /> Security Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Policy for this company copy. Lockdown writes a cookie this app honors. WAF rows are intent records, not Cloudflare.
          </p>
        </div>
        <Button variant="destructive" className="gap-2" onClick={() => setLockOpen(true)}>
          <AlertOctagon className="h-4 w-4" /> {policy.lockdown ? 'Lift lockdown' : 'System lockdown'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lockdown</p>
            <h3 className="text-2xl font-semibold">{policy.lockdown ? 'On' : 'Off'}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">MFA required (login gate)</p>
            <h3 className="text-2xl font-semibold">{policy.mfaRequired ? 'On' : 'Off'}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Blocked IPs (this browser)</p>
            <h3 className="text-2xl font-semibold">{policy.blockedIps.length}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Multi-factor</CardTitle>
          <CardDescription>When on, the next sign-in asks for a demo code 000000. Not a hardware authenticator.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="mfa">Require step-up on login</Label>
          <Switch
            id="mfa"
            checked={policy.mfaRequired}
            onCheckedChange={(v) => {
              save({ ...policy, mfaRequired: v }, 'security.mfa', String(v));
              toast.success(v ? 'MFA gate on for next login.' : 'MFA gate off.');
            }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" /> IP denylist
            </CardTitle>
            <CardDescription>Saved locally. Middleware does not yet drop these packets at the edge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                aria-label="IP address"
                placeholder="203.0.113.10"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <Button onClick={handleBlockIp}>Block</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.blockedIps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No IPs stored.
                    </TableCell>
                  </TableRow>
                ) : (
                  policy.blockedIps.map((item) => (
                    <TableRow key={item.ip}>
                      <TableCell className="font-code">{item.ip}</TableCell>
                      <TableCell className="text-xs">{item.reason}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            save(
                              { ...policy, blockedIps: policy.blockedIps.filter((b) => b.ip !== item.ip) },
                              'security.unblock_ip',
                              item.ip
                            );
                            toast.success('IP removed from this device list.');
                          }}
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy intent (not a WAF)</CardTitle>
            <CardDescription>Toggles persist after refresh. They do not reconfigure Vercel or Cloudflare.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {WAF.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-4 border p-3">
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">{rule.note}</p>
                </div>
                <Switch
                  checked={policy.waf[rule.id]}
                  onCheckedChange={(v) => {
                    save({ ...policy, waf: { ...policy.waf, [rule.id]: v } }, 'security.waf', `${rule.id}:${v}`);
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Certificates
          </CardTitle>
          <CardDescription>Display only. Auto-renew is owned by the host (Vercel / Let&apos;s Encrypt).</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Remember auto-renew preference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>*.optitalent.com</TableCell>
                <TableCell>
                  <Badge>Host managed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={policy.sslAutoRenew.wildcard}
                    onCheckedChange={(v) =>
                      save({ ...policy, sslAutoRenew: { ...policy.sslAutoRenew, wildcard: v } }, 'security.ssl', `wildcard:${v}`)
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={lockOpen} onOpenChange={setLockOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{policy.lockdown ? 'Lift system lockdown?' : 'Lock the workspace?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {policy.lockdown
                ? 'People will be able to open HR screens again on this browser.'
                : 'Other HR routes will redirect to the suspended page until you lift lockdown. Login and this security screen stay open.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const next = !policy.lockdown;
                save({ ...policy, lockdown: next }, 'security.lockdown', String(next));
                toast.success(next ? 'Lockdown cookie set.' : 'Lockdown lifted.');
                setLockOpen(false);
              }}
            >
              {policy.lockdown ? 'Lift lockdown' : 'Lock workspace'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
