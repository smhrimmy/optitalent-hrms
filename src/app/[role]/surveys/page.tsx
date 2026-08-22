'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { useToast } from '@/hooks/use-toast';

export default function SurveysPage() {
  const db = useDataQuery();
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Engagement surveys</h1>
        <p className="text-muted-foreground">Pulse and onboarding checks, scored like Culture Amp / BambooHR eNPS — stored next to the employee file.</p>
      </div>
      {db.surveys.map(s => (
        <Card key={s.id}>
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle className="text-base">{s.title}</CardTitle>
              <CardDescription>{s.audience} · {s.responses} responses {s.score != null && `· score ${s.score}`}</CardDescription>
            </div>
            <Badge>{s.status}</Badge>
          </CardHeader>
          {s.status === 'Open' && (
            <CardContent>
              <Button onClick={() => { dataQuery.respondSurvey(s.id); toast({ title: 'Response recorded' }); }}>Submit pulse (demo)</Button>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
