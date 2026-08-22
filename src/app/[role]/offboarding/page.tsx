'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export default function OffboardingPage() {
  const db = useDataQuery();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employee_name: '', last_working_day: '', reason: '' });

  const start = () => {
    dataQuery.addOffboarding({
      employee_id: `exit-${Date.now()}`,
      employee_name: form.employee_name,
      last_working_day: form.last_working_day,
      reason: form.reason,
    });
    toast({ title: 'Exit initiated', description: 'Clearance checklist created.' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Offboarding</h1>
          <p className="text-muted-foreground">Resignations, clearance, asset return, and final settlement.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Start exit</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Initiate offboarding</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Employee</Label><Input value={form.employee_name} onChange={e => setForm({ ...form, employee_name: e.target.value })} /></div>
              <div className="space-y-1"><Label>Last working day</Label><Input type="date" value={form.last_working_day} onChange={e => setForm({ ...form, last_working_day: e.target.value })} /></div>
              <div className="space-y-1"><Label>Reason</Label><Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={start}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {db.offboarding.map(o => (
        <Card key={o.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {o.employee_name}
              <Badge>{o.status}</Badge>
            </CardTitle>
            <CardDescription>Last day {o.last_working_day} · {o.reason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {o.checklist.map(item => (
              <label key={item.item} className="flex items-center gap-2 text-sm">
                <Checkbox checked={item.done} onCheckedChange={() => dataQuery.toggleOffboardingItem(o.id, item.item)} />
                {item.item}
              </label>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle>Holiday calendar</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Holiday</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead></TableRow></TableHeader>
            <TableBody>
              {db.holidays.map(h => (
                <TableRow key={h.id}>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>{h.date}</TableCell>
                  <TableCell><Badge variant="secondary">{h.type}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
