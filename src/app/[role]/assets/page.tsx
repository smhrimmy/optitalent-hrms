'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AssetsPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignId, setAssignId] = useState<string>('');
  const [employee, setEmployee] = useState<string>('');

  const assign = () => {
    const emp = db.employees.find(e => e.profile.id === employee);
    if (!assignId || !emp) return;
    dataQuery.assignAsset(assignId, emp.profile.id, emp.profile.full_name);
    toast({ title: 'Asset assigned', description: `${emp.profile.full_name} now holds this asset.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Assets & Inventory</h1>
        <p className="text-muted-foreground">Track laptops, phones, and equipment from issue to return.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {['Assigned', 'Available', 'In Repair', 'Retired'].map(s => (
          <Card key={s}><CardHeader><CardTitle className="text-sm">{s}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{db.assets.filter(a => a.status === s).length}</CardContent>
          </Card>
        ))}
      </div>
      {['admin', 'it-manager', 'hr'].includes(user?.role || '') && (
        <Card>
          <CardHeader><CardTitle>Assign asset</CardTitle></CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <Select value={assignId} onValueChange={setAssignId}>
              <SelectTrigger className="md:w-64"><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>
                {db.assets.filter(a => a.status === 'Available').map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name} · {a.serial}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="md:w-64"><SelectValue placeholder="Employee" /></SelectTrigger>
              <SelectContent>
                {db.employees.map(e => (
                  <SelectItem key={e.profile.id} value={e.profile.id}>{e.profile.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={assign}>Assign</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>{db.assets.length} assets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {db.assets.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.type}</TableCell>
                  <TableCell>{a.serial}</TableCell>
                  <TableCell>{a.assigned_name || '—'}</TableCell>
                  <TableCell><Badge variant="secondary">{a.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
