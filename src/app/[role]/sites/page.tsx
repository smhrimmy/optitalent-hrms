'use client';

import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Construction"
        title="HQ → project → site → contractor → worker"
        lede="Geo-fenced site attendance, daily wage, safety certification, accommodation, and contractor labour categories."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metro Package 4 · Site 12</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>Contractor: Apex Civil · 186 workers on site today</p>
          <p>Safety induction due: 14 · License gaps: 3</p>
          <p>Wage type: daily + OT after 8h · Geo-fence: 400m</p>
        </CardContent>
      </Card>
    </div>
  );
}
