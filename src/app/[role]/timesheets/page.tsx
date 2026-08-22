'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export default function TimesheetsPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const { toast } = useToast();
  const isApprover = ['admin', 'manager', 'hr', 'finance'].includes(user?.role || '');
  const rows = isApprover ? db.timesheets : db.timesheets.filter(t => t.employee_id === user?.profile.id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ project: '', date: '', hours: '8', notes: '', billable: true });

  const submit = () => {
    if (!user) return;
    dataQuery.addTimesheet({
      employee_id: user.profile.id,
      employee_name: user.profile.full_name,
      project: form.project || 'Internal',
      date: form.date || new Date().toISOString().slice(0, 10),
      hours: Number(form.hours) || 0,
      billable: form.billable,
      notes: form.notes,
      status: 'Submitted',
    });
    toast({ title: 'Timesheet logged' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Timesheets</h1>
          <p className="text-muted-foreground">Project hours that can feed payroll and billing.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Log hours</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log time</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Project</Label><Input value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div className="space-y-1"><Label>Hours</Label><Input type="number" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.billable} onCheckedChange={(v) => setForm({ ...form, billable: v })} /><Label>Billable</Label></div>
              <div className="space-y-1"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>{rows.reduce((s, r) => s + r.hours, 0)} hours this view</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isApprover && <TableHead>Employee</TableHead>}
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Status</TableHead>
                {isApprover && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  {isApprover && <TableCell>{r.employee_name}</TableCell>}
                  <TableCell>{r.project}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.hours}</TableCell>
                  <TableCell>{r.billable ? 'Yes' : 'No'}</TableCell>
                  <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                  {isApprover && r.status !== 'Approved' && (
                    <TableCell><Button size="sm" onClick={() => dataQuery.updateTimesheetStatus(r.id, 'Approved')}>Approve</Button></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
