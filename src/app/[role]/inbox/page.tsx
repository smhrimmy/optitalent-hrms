'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { EmptyState } from '@/components/empty-state';
import { Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InboxPage() {
  const db = useDataQuery();
  const { toast } = useToast();
  const pending = db.approvals.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals inbox</h1>
        <p className="text-muted-foreground">Leave, expenses, timesheets, and offers in one queue — the Rippling/Workday manager pattern.</p>
      </div>
      {pending.length === 0 ? (
        <EmptyState icon={Inbox} title="Inbox is clear" description="Nothing waiting on you. New leave and claims will land here." />
      ) : (
        <div className="space-y-3">
          {db.approvals.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <CardDescription>{a.kind} · {a.requester}</CardDescription>
                </div>
                <Badge variant={a.status === 'Pending' ? 'secondary' : 'default'}>{a.status}</Badge>
              </CardHeader>
              {a.status === 'Pending' && (
                <CardContent className="flex gap-2">
                  <Button size="sm" onClick={() => { dataQuery.decideApproval(a.id, 'Approved'); toast({ title: 'Approved' }); }}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => { dataQuery.decideApproval(a.id, 'Rejected'); toast({ title: 'Rejected' }); }}>Reject</Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
