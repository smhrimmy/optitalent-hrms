'use client';

import { useMemo, useState } from 'react';
import { useDataQuery } from '@/hooks/use-dataquery';
import { listTwins, orgTree } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function DigitalTwinPage() {
  const db = useDataQuery();
  const twins = useMemo(() => listTwins(db), [db]);
  const tree = useMemo(() => orgTree(twins), [twins]);
  const [id, setId] = useState(twins.find((t) => t.employee_id === 'PEP0012')?.id || twins[0]?.id);
  const person = twins.find((t) => t.id === id) || twins[0];
  const journey = db.journeyEvents.filter((e) => e.employee_id === person?.id);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Workforce digital twin"
        title="A live model of the organization"
        lede="Every person sits on one graph: skills, load, learning, compensation position, manager cadence, and dependencies. The twin recalculates as attendance, goals, and tickets move."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {tree.map((node) => (
              <div key={node.name}>
                <div className="flex justify-between">
                  <span className="font-medium">{node.name}</span>
                  <span className="text-muted-foreground">{node.headcount}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Load {node.avgWorkload}% · attention {node.avgRisk}%
                </p>
                <ul className="space-y-1">
                  {node.people.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setId(p.id)}
                        className={`w-full text-left rounded px-2 py-1 ${
                          p.id === id ? 'bg-muted' : 'hover:bg-muted/60'
                        }`}
                      >
                        {p.name}
                        <span className="text-muted-foreground"> · {p.role}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {person ? (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{person.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {person.role} · {person.department}
                  </p>
                </div>
                <Badge variant="outline">Attention {person.attritionRisk}%</Badge>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                {Object.entries(person.signals).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                    <Progress value={v} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Primary signals</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {person.primarySignals.map((s) => (
                    <p key={s}>• {s}</p>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2">
                    Presented as decision support, not an automated judgment.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommended next</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {person.recommendedActions.map((s, i) => (
                    <p key={s}>
                      {i + 1}. {s}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {person.skills.map((s) => (
                  <Badge key={s.name} variant="secondary">
                    {s.name} {s.proficiency}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Employee journey graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {journey.length ? (
                  journey.map((e) => (
                    <div key={e.id} className="border-l-2 pl-3">
                      <p className="text-xs text-muted-foreground">
                        {e.at} · {e.kind}
                      </p>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-muted-foreground">{e.detail}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No journey events stored yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
