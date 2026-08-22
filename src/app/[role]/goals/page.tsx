'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';

export default function GoalsPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', key_result: '' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals & OKRs</h1>
          <p className="text-muted-foreground">Continuous goals that feed reviews and compensation — Lattice/Workday style, on the same employee record.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Add goal</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New objective</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Objective</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Key result</Label><Input value={form.key_result} onChange={e => setForm({ ...form, key_result: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                if (!user) return;
                dataQuery.addGoal({ owner: user.profile.full_name, owner_id: user.profile.id, title: form.title, key_result: form.key_result, progress: 0, status: 'On track', cycle: 'Q3 2026' });
                setOpen(false);
              }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {db.goals.map(g => (
          <Card key={g.id}>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-base">{g.title}</CardTitle>
              <Badge>{g.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{g.owner} · {g.key_result}</p>
              <Progress value={g.progress} />
              <p className="text-xs">{g.progress}% · {g.cycle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
