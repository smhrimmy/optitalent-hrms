'use client';

import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DRIVERS = [
  { name: 'Suresh K', license: 'KA-05-2028', vehicle: 'TN-38-HUB-12', route: 'Hub → Whitefield' },
  { name: 'Farida N', license: 'MH-12-2027', vehicle: 'MH-04-HUB-03', route: 'Hub → Pune east' },
];

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Logistics"
        title="Driver, vehicle, route, trip pay"
        lede="License expiry, GPS hub attendance, contractor drivers, and trip-based compensation sit next to overtime — not in a generic timesheet."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {DRIVERS.map((d) => (
          <Card key={d.license}>
            <CardHeader>
              <CardTitle className="text-base">{d.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>License {d.license}</p>
              <p>{d.vehicle}</p>
              <p>{d.route}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
