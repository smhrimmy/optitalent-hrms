'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { runWorkforceAgent } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WorkflowsPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const [last, setLast] = useState<string | null>(null);

  const run = (id: string) => {
    if (!user) return;
    const actor = {
      name: user.profile.full_name,
      role: user.role,
      profileId: user.profile.id,
      employeeId: user.profile.employee_id,
    };
    if (id === 'wf-new-hire') {
      const r = runWorkforceAgent(
        'Prepare everything required for onboarding the new frontend engineer joining Monday',
        actor
      );
      setLast(r.reply);
      return;
    }
    if (id === 'wf-exit') {
      const r = runWorkforceAgent('Start exit workflow', actor);
      setLast(r.reply);
      return;
    }
    const r = runWorkforceAgent('Run promotion pack', actor);
    setLast(r.reply);
  };

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="HR automation marketplace"
        title="Install recipes. Execute them on the graph."
        lede="WHEN probation completes CHECK performance ≥ 75 IF YES confirm, letter, payroll eligibility. No-code intent — executable today via the Chief of Staff."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {db.workflowRecipes.map((w) => (
          <Card key={w.id}>
            <CardHeader>
              <div className="flex justify-between gap-2">
                <CardTitle className="text-base">{w.name}</CardTitle>
                <Badge variant={w.installed ? 'default' : 'outline'}>
                  {w.installed ? 'Installed' : 'Available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{w.description}</p>
              <p className="text-xs">WHEN {w.trigger}</p>
              <ol className="list-decimal pl-4 space-y-1">
                {w.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => dataQuery.toggleWorkflowInstall(w.id)}>
                  {w.installed ? 'Remove' : 'Install'}
                </Button>
                <Button size="sm" onClick={() => run(w.id)} disabled={!w.installed}>
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {last ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last execution</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-sans">{last}</pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
