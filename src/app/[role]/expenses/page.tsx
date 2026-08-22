'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { dataQuery, type ExpenseStatus } from '@/lib/dataquery';
import { useDataQuery } from '@/hooks/use-dataquery';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export default function ExpensesPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const { toast } = useToast();
  const isApprover = ['admin', 'hr', 'finance', 'manager'].includes(user?.role || '');
  const rows = isApprover ? db.expenses : db.expenses.filter(e => e.employee_id === user?.profile.id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: 'Travel', amount: '', date: '', description: '' });

  const totals = useMemo(() => ({
    submitted: rows.filter(r => r.status === 'Submitted').reduce((s, r) => s + r.amount, 0),
    approved: rows.filter(r => r.status === 'Approved' || r.status === 'Reimbursed').reduce((s, r) => s + r.amount, 0),
  }), [rows]);

  const submit = () => {
    if (!user) return;
    dataQuery.addExpense({
      employee_id: user.profile.id,
      employee_name: user.profile.full_name,
      category: form.category,
      amount: Number(form.amount) || 0,
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description,
    });
    toast({ title: 'Claim submitted', description: 'Finance will review your expense.' });
    setOpen(false);
    setForm({ category: 'Travel', amount: '', date: '', description: '' });
  };

  const badge = (status: ExpenseStatus) => {
    const map: Record<string, string> = {
      Submitted: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-blue-100 text-blue-800',
      Reimbursed: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={map[status] || ''}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Expenses & Claims</h1>
          <p className="text-muted-foreground">Travel, internet, meals, and reimbursements in one ledger.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> New Claim</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit expense</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Travel', 'Internet', 'Meals', 'Office supplies', 'Training'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
                <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Submit</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent className="text-2xl font-bold">₹{totals.submitted.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>Approved / Paid</CardTitle></CardHeader><CardContent className="text-2xl font-bold">₹{totals.approved.toLocaleString()}</CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>{rows.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isApprover && <TableHead>Employee</TableHead>}
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                {isApprover && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  {isApprover && <TableCell>{r.employee_name}</TableCell>}
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>₹{r.amount.toLocaleString()}</TableCell>
                  <TableCell>{badge(r.status)}</TableCell>
                  {isApprover && (
                    <TableCell className="text-right space-x-2">
                      {r.status === 'Submitted' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => dataQuery.updateExpenseStatus(r.id, 'Approved')}>Approve</Button>
                          <Button size="sm" onClick={() => dataQuery.updateExpenseStatus(r.id, 'Reimbursed')}>Reimburse</Button>
                          <Button size="sm" variant="destructive" onClick={() => dataQuery.updateExpenseStatus(r.id, 'Rejected')}>Reject</Button>
                        </>
                      )}
                    </TableCell>
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
