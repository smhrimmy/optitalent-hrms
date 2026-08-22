'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { TARGET_ROLES, talentPath } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function TalentMarketplacePage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const [target, setTarget] = useState<(typeof TARGET_ROLES)[number]['id']>('devops');
  const path = useMemo(
    () => talentPath(user?.profile.id || '', target, db),
    [user?.profile.id, target, db]
  );

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Internal talent marketplace"
        title="Close the skill gap before you hire outside"
        lede="Say you want to become a DevOps engineer. The graph compares current skills to the target role, then points at courses, projects, mentors, and people already close."
      />
      <div className="flex flex-wrap gap-2">
        {TARGET_ROLES.map((r) => (
          <Button
            key={r.id}
            size="sm"
            variant={r.id === target ? 'default' : 'outline'}
            onClick={() => setTarget(r.id)}
          >
            {r.title}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Current: {path.current} → Target: {path.target}
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill gap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {path.gaps.map((g) => (
            <div key={g.skill}>
              <div className="flex justify-between text-sm mb-1">
                <span>{g.skill}</span>
                <span className="tabular-nums">
                  {g.current} / {g.target}
                </span>
              </div>
              <Progress value={Math.min(100, (g.current / g.target) * 100)} />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {path.recommended.map((r) => (
              <p key={r}>✓ {r}</p>
            ))}
            {path.courses.map((c) => (
              <p key={c} className="text-muted-foreground">
                Course: {c}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Internal candidates (before a req)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {path.internals.map((p) => (
              <div key={p.name} className="flex justify-between">
                <span>
                  {p.name} · {p.role}
                </span>
                <span className="tabular-nums">{p.score}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
