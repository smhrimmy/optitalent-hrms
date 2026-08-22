'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { peopleBrief } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent } from '@/components/ui/card';

export default function PeopleBriefPage() {
  const db = useDataQuery();
  const brief = peopleBrief(db);

  return (
    <div className="space-y-8 max-w-2xl">
      <OsHeader
        kicker="AI-generated people briefing"
        title="Monday morning, without another dashboard"
        lede="Executives get a brief: what moved, where load is rising, what to do. The command center remains one click away."
      />
      <Card>
        <CardContent className="pt-6 space-y-3 text-sm leading-relaxed">
          <p className="font-headline text-xl">{brief.title}</p>
          {brief.bullets.map((b) => (
            <p key={b}>{b}</p>
          ))}
          <p className="font-medium pt-2">Recommended action: {brief.recommended}</p>
        </CardContent>
      </Card>
    </div>
  );
}
