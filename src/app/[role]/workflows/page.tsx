'use client';

import { useLocalCollection } from '@/hooks/use-local-collection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

type Step = { id: string; label: string };
type Flow = { id: string; name: string; steps: Step[] };

export default function WorkflowsPage() {
  const { items, persist } = useLocalCollection<Flow>('ot_workflows', [
    {
      id: 'leave',
      name: 'Leave request',
      steps: [
        { id: '1', label: 'Employee submits' },
        { id: '2', label: 'Check balance' },
        { id: '3', label: 'Manager approval' },
        { id: '4', label: 'If over 7 days, HR approval' },
        { id: '5', label: 'Update balance and notify' },
      ],
    },
  ]);
  const [name, setName] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Workflow sketches</h1>
        <p className="text-muted-foreground">
          These diagrams are drafts. They do not execute approvals. Leave still uses the Leaves module.
        </p>
      </div>
      <form
        className="flex gap-2 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          persist([...items, { id: crypto.randomUUID(), name, steps: [{ id: 's1', label: 'Start' }] }]);
          setName('');
          toast.success('Sketch saved on this device.');
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="wf">Name</Label>
          <Input id="wf" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <Button type="submit">Add sketch</Button>
      </form>
      {items.map((flow) => (
        <article key={flow.id} className="border bg-card p-4 space-y-3">
          <h2 className="font-headline text-xl">{flow.name}</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            {flow.steps.map((s) => (
              <li key={s.id}>{s.label}</li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
