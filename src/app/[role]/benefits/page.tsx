'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';

export default function BenefitsPage() {
  const db = useDataQuery();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Benefits</h1>
        <p className="text-muted-foreground">Enrol or waive plans from self-service. Payroll deductions follow enrolment.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {db.benefits.map(b => (
          <Card key={b.id}>
            <CardHeader>
              <CardTitle className="flex justify-between text-base">
                {b.name}
                <Badge variant={b.enrolled ? 'default' : 'secondary'}>{b.enrolled ? 'Enrolled' : 'Not enrolled'}</Badge>
              </CardTitle>
              <CardDescription>{b.type} · {b.coverage}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => dataQuery.toggleBenefit(b.id)}>
                {b.enrolled ? 'Waive' : 'Enrol'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
