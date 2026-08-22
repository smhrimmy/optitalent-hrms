'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { workHealth } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function WorkHealthPage() {
  const { user } = useAuth();
  const db = useDataQuery();
  const health = workHealth(user?.profile.id || '', db);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Work health"
        title="Organizational load — not medical health"
        lede="The system can recommend a conversation or a redistribution. It does not diagnose people."
      />
      {!health ? (
        <p className="text-muted-foreground">Sign in to see your work-health twin.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(health.scores).map(([k, v]) => (
              <Card key={k}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{k}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-headline tabular-nums">{v}%</p>
                  <Progress className="mt-2" value={v} />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="pt-6 text-sm">{health.note}</CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
