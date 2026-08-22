'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { interpretPolicy } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

export default function ComplianceIqPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const wfh = interpretPolicy('Can I work from home this Friday?', user?.profile.id, db);
  const net = interpretPolicy('Can I claim internet reimbursement?', user?.profile.id, db);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="India compliance intelligence"
        title="Not “payroll calculated PF” — a health monitor"
        lede="PF, ESI, PT, TDS, LWF, gratuity, bonus, leave, and working hours sit as rules with payroll impact and an HR alert when the window is tight."
      />
      <div className="grid md:grid-cols-2 gap-3">
        {db.complianceItems.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-base">{c.statute}</CardTitle>
                <p className="text-xs text-muted-foreground">{c.jurisdiction}</p>
              </div>
              <Badge variant={c.status === 'Healthy' ? 'secondary' : c.status === 'Watch' ? 'outline' : 'destructive'}>
                {c.status}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{c.note}</p>
              <p className="text-muted-foreground">Payroll impact: {c.payroll_impact}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy → executable rule</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            {db.policies.map((p) => (
              <div key={p.id}>
                <p className="font-medium">{p.title}</p>
                <p className="text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Knowledge brain (this company, this person)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <p className="font-medium">“Can I claim internet reimbursement?”</p>
              <p className="text-muted-foreground">{net.answer}</p>
            </div>
            <div>
              <p className="font-medium">“Request work-from-home.”</p>
              <p className="text-muted-foreground">{wfh.answer}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
