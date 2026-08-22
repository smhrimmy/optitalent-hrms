'use client';

import { useMemo, useState } from 'react';
import { simulateHire, simulateAttrition } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SimulatorPage() {
  const [n, setN] = useState(20);
  const [leavePct, setLeavePct] = useState(10);
  const hire = useMemo(() => simulateHire(n), [n]);
  const leave = useMemo(() => simulateAttrition(leavePct, 'Engineering'), [leavePct]);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="What-if HR simulator"
        title="Ask what happens if — before you open the req"
        lede="Hiring is not only a salary line. It collides with manager span, induction desks, laptops, and delivery capacity."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hire developers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="hires">Headcount to add</Label>
              <Input
                id="hires"
                type="number"
                min={0}
                max={200}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
              />
            </div>
            <Button type="button" onClick={() => setN(20)}>
              Reset to +20
            </Button>
            <dl className="text-sm space-y-2">
              <Row k="Recruitment cost" v={hire.formatted.recruitmentCost} />
              <Row k="Salary cost (annual CTC)" v={hire.formatted.salaryCost} />
              <Row k="Projected annual workforce cost" v={hire.formatted.annualWorkforce} />
              <Row k="Hiring timeline" v={`~${hire.timelineWeeks} weeks`} />
              <Row k="Manager capacity" v={hire.managerCapacity} />
              <Row k="Onboarding capacity" v={hire.onboardingCapacity} />
              <Row k="Workspace / kit" v={hire.workspace} />
              <Row k="Project capacity" v={hire.projectCapacity} />
              <Row k="Revenue / delivery capacity" v={hire.revenueCapacity} />
              <Row k="Bottleneck" v={hire.bottleneck} />
              <Row k="Recommended extra managers" v={String(hire.extraManagers)} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">If 10% of engineering leaves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="pct">Percent leaving</Label>
              <Input
                id="pct"
                type="number"
                min={0}
                max={80}
                value={leavePct}
                onChange={(e) => setLeavePct(Number(e.target.value))}
              />
            </div>
            <p className="text-sm">
              {leave.leavers} people in the directional model · replacement {leave.replacementCost}
            </p>
            <p className="text-sm text-muted-foreground">Teams hit: {leave.teamsHit.join(', ') || '—'}</p>
            <p className="text-sm">Skill holes: {leave.skillHoles.join(', ') || '—'}</p>
            <ul className="text-sm list-disc pl-5">
              {leave.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
