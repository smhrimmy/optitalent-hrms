'use client';

import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CREDS = [
  { name: 'Dr. Meera Iyer', license: 'KMC-44291', expires: '2026-11-02', status: 'Watch' },
  { name: 'Nurse Rohan Das', license: 'KNMC-1182', expires: '2027-03-14', status: 'Healthy' },
  { name: 'Tech Anil P', license: 'AERB-009', expires: '2026-09-01', status: 'Action' },
];

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Credential management"
        title="License → expiry → verification → eligibility"
        lede="Licensed professionals cannot be rostered onto a clinical shift if the credential is expired. Restricted medical fields stay field-locked."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {CREDS.map((c) => (
          <Card key={c.license}>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-base">{c.name}</CardTitle>
              <Badge variant={c.status === 'Healthy' ? 'secondary' : 'outline'}>{c.status}</Badge>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{c.license}</p>
              <p>Expires {c.expires}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
