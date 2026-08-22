'use client';

import { JOINER_FLOW, EXIT_FLOW } from '@/engines/workflow';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LifecyclePage() {
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Lifecycle automation"
        title="Offer → probation, and resignation → alumni"
        lede="Workflows are recipes on the graph, not hardcoded screens named after one company."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New employee</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {JOINER_FLOW.map((s) => (
              <p key={s.id}>
                {s.done ? '✓' : '○'} {s.title}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employee exits</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {EXIT_FLOW.map((s) => (
              <p key={s.id}>
                ○ {s.title}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
