'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { matchOpportunities } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const db = useDataQuery();
  const rows = matchOpportunities(user?.profile.id || '', db);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Opportunity marketplace"
        title="Discover work, not only tasks assigned to you"
        lede="Internal projects, mentoring, training seats, and open roles are matched to the skills already on your twin."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((o) => (
          <Card key={o.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle className="text-base">{o.title}</CardTitle>
              <Badge>{o.kind}</Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground">
                {o.owner} · {o.seats} seat{o.seats === 1 ? '' : 's'}
              </p>
              <p>Skill overlap: {o.match}</p>
              <div className="flex flex-wrap gap-1">
                {o.skills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
