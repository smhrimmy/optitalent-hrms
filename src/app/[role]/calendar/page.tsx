'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDataQuery } from '@/hooks/use-dataquery';

export default function PeopleCalendarPage() {
  const db = useDataQuery();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">People calendar</h1>
        <p className="text-muted-foreground">Holidays plus approved leave so managers see who is out — BambooHR time-off calendar pattern.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Company holidays</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {db.holidays.map(h => (
            <div key={h.id} className="flex justify-between border-b py-2 text-sm">
              <span>{h.name}</span>
              <span className="text-muted-foreground">{h.date} · {h.type}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Approved time off</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {db.leaveRequests.filter(l => l.status === 'Approved').map(l => (
            <div key={l.id} className="flex justify-between py-2 text-sm border-b">
              <span>{l.employee_name} · {l.leave_type}</span>
              <Badge variant="secondary">{l.start_date} → {l.end_date}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
