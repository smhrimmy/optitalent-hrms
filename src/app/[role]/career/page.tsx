'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { TARGET_ROLES, talentPath } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CareerPage() {
  const { user } = useAuth();
  const db = useDataQuery();
  const [target, setTarget] = useState<(typeof TARGET_ROLES)[number]['id']>('devops');
  const path = useMemo(() => talentPath(user?.profile.id || '', target, db), [user?.profile.id, target, db]);
  const readiness = Math.round(
    (path.gaps.reduce((a, g) => a + Math.min(g.current, g.target), 0) /
      Math.max(1, path.gaps.reduce((a, g) => a + g.target, 0))) *
      100
  );
  const missing = path.gaps.filter((g) => g.current < g.target * 0.7).map((g) => g.skill);

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Career intelligence"
        title="Target a role. See the gap. Then the marketplace."
        lede="Skills, courses, projects, and internal vacancies share the same graph — this is not a separate LMS."
      />
      <div className="flex flex-wrap gap-2">
        {TARGET_ROLES.map((r) => (
          <Button key={r.id} size="sm" variant={r.id === target ? 'default' : 'outline'} onClick={() => setTarget(r.id)}>
            {r.title}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Career readiness {readiness}%</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={readiness} />
          <p className="text-sm text-muted-foreground mt-3">Missing: {missing.join(', ') || 'None material'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended next</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          {path.recommended.map((r) => (
            <p key={r}>✓ {r}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
