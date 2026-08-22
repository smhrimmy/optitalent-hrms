'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDataQuery } from '@/hooks/use-dataquery';
import { Badge } from '@/components/ui/badge';

export default function OrgChartPage() {
  const db = useDataQuery();
  const byDept = db.employees.reduce<Record<string, typeof db.employees>>((acc, emp) => {
    const key = emp.profile.department.name;
    acc[key] = acc[key] || [];
    acc[key].push(emp);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Organization Chart</h1>
        <p className="text-muted-foreground">Live hierarchy grouped by department from Core HR.</p>
      </div>
      <div className="grid gap-6">
        {Object.entries(byDept).map(([dept, people]) => (
          <Card key={dept}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {dept}
                <Badge variant="secondary">{people.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {people.map(p => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarImage src={p.profile.profile_picture_url} />
                    <AvatarFallback>{p.profile.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{p.profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{p.profile.job_title}</p>
                    <p className="text-xs text-muted-foreground">{p.profile.employee_id}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
