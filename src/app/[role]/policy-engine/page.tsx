'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PolicyEnginePage() {
  const db = useDataQuery();
  const { policies, approvals } = db.company;

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Policy + approval engines"
        title="Conditions, not hardcoded if-employee-type"
        lede="Leave, overtime, expenses, and approvals are rules with a configuration layer. Effective policy is resolved down the hierarchy: country → state → location → department → employment type → employee."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {policies.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <Badge variant="outline">{p.layer}</Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.kind}</p>
              <p>
                IF{' '}
                {p.when.map((w) => `${w.field} ${w.op} ${Array.isArray(w.value) ? w.value.join('|') : w.value}`).join(' AND ')}
              </p>
              <p className="font-medium">THEN {p.then}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {approvals.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="text-base">{a.trigger}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {a.bands.map((b) => (
                <p key={b.when}>
                  {b.when} → {b.approvers.join(' + ')}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
