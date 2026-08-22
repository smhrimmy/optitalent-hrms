'use client';

import { useState } from 'react';
import { useDataQuery } from '@/hooks/use-dataquery';
import { whyEngine } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const METRICS = ['Attrition', 'Hiring', 'Overtime'];

export default function WhyPage() {
  const db = useDataQuery();
  const [metric, setMetric] = useState('Attrition');
  const why = whyEngine(metric, db);

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="Why engine"
        title="Every major metric has a Why"
        lede="Dashboards already tell you the number. This page names contributors and the intervention — so analytics is usable on a Monday morning."
      />
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <Button key={m} variant={m === metric ? 'default' : 'outline'} size="sm" onClick={() => setMetric(m)}>
            {m}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {why.metric}: {why.value}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold mb-3">Top contributors</h2>
            <ul className="space-y-2 text-sm">
              {why.contributors.map((c, i) => (
                <li key={c.label} className="flex justify-between gap-4">
                  <span>
                    {i + 1}. {c.label}
                  </span>
                  <span className="tabular-nums">{c.share}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-3">What should we do?</h2>
            <ul className="space-y-3 text-sm">
              {why.interventions.map((i) => (
                <li key={i.area}>
                  <p className="font-medium">{i.area}</p>
                  <p className="text-muted-foreground">→ {i.action}</p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
