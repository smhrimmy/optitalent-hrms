'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { managerCopilot } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ManagerCopilotPage() {
  const { user } = useAuth();
  useDataQuery();
  const dash = managerCopilot(user?.profile.full_name || 'Manager');

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Manager copilot"
        title="What requires my attention today?"
        lede="Most HRMS products optimize for HR. This layer is for the manager who has twelve people and twenty minutes."
      />
      <p className="text-sm text-muted-foreground">My team · {dash.size} people</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Performance', dash.performance],
          ['Engagement', dash.engagement],
          ['Workload', dash.workload],
          ['Attrition attention', dash.attritionRisk],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-headline tabular-nums">{value}%</p>
              <Progress className="mt-2" value={Number(value)} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dash.items.length} items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {dash.items.map((item, i) => (
            <div key={item.person} className="flex justify-between gap-4 border-b pb-2">
              <div>
                <p className="font-medium">
                  {i + 1}. {item.person}
                </p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
              <span className="tabular-nums text-muted-foreground">{item.risk}%</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
