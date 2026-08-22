'use client';

import { useMemo, useState } from 'react';
import { useDataQuery } from '@/hooks/use-dataquery';
import { effectivePolicies, type PolicySubject } from '@/engines/policy';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function EffectivePolicyPage() {
  const db = useDataQuery();
  const [subject, setSubject] = useState<PolicySubject>({
    country: 'India',
    employmentType: 'Full-time',
    tenureMonths: 14,
    state: 'Karnataka',
    workerType: 'Full-time',
    shift: 'Night',
    department: 'Engineering',
  });
  const rows = useMemo(() => effectivePolicies(db.company, subject), [db.company, subject]);

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Effective policy viewer"
        title="Why does this person have this policy?"
        lede="Configuration is a hierarchy. This screen shows the winning rule, where it was inherited, and whether anything overrode it."
      />
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <Label>Country</Label>
          <Input value={subject.country} onChange={(e) => setSubject({ ...subject, country: e.target.value })} />
        </div>
        <div>
          <Label>Employment type</Label>
          <Input value={subject.employmentType} onChange={(e) => setSubject({ ...subject, employmentType: e.target.value })} />
        </div>
        <div>
          <Label>Tenure (months)</Label>
          <Input type="number" value={subject.tenureMonths} onChange={(e) => setSubject({ ...subject, tenureMonths: Number(e.target.value) })} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="text-lg font-headline">{p.result}</p>
              <p>Source: {p.source}</p>
              <p>Inherited from: {p.inheritedFrom}</p>
              <p>Overridden by: {p.overriddenBy}</p>
              <p>Effective: {p.effective}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
