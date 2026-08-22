'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDataQuery } from '@/hooks/use-dataquery';

export default function CompensationPage() {
  const db = useDataQuery();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compensation bands</h1>
        <p className="text-muted-foreground">Pay ranges by role and location so merit cycles stay inside a published band (Rippling Compensation / Workday Comp).</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Published ranges</CardTitle>
          <CardDescription>Amounts in annual CTC</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Mid</TableHead>
                <TableHead>Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {db.compensation.map(b => (
                <TableRow key={b.id}>
                  <TableCell>{b.role}</TableCell>
                  <TableCell>{b.level}</TableCell>
                  <TableCell>{b.location}</TableCell>
                  <TableCell>₹{(b.min/100000).toFixed(1)}L</TableCell>
                  <TableCell>₹{(b.mid/100000).toFixed(1)}L</TableCell>
                  <TableCell>₹{(b.max/100000).toFixed(1)}L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
