'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLANTS = [
  { name: 'Plant A · Bengaluru', shifts: '3 rotating + night', workers: 820, contractors: 140, biometric: true },
  { name: 'Plant B · Pune', shifts: '2 shift', workers: 540, contractors: 90, biometric: true },
  { name: 'Plant C · Chennai', shifts: 'General + OT', workers: 310, contractors: 40, biometric: false },
];

export default function PlantsPage() {
  useDataQuery();
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Factory mode"
        title="Attendance is a chain, not a checkbox"
        lede="Punch → working hours → late/early → overtime → night allowance → leave → payroll. Plants, worker categories, muster, and contractors are first-class."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {PLANTS.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{p.shifts}</p>
              <p>{p.workers} workers · {p.contractors} contractors</p>
              <p>{p.biometric ? 'Biometric live' : 'Roster / manual'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
