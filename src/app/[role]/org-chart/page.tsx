'use client';

import { useLocalCollection } from '@/hooks/use-local-collection';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';

type Node = { id: string; name: string; title: string; reportsTo: string };

export default function OrgChartPage() {
  const { items, persist } = useLocalCollection<Node>('ot_org', [
    { id: '1', name: 'Jackson Lee', title: 'Head of HR', reportsTo: '—' },
    { id: '2', name: 'Asha Rao', title: 'Specialist', reportsTo: 'Jackson Lee' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-semibold">Org chart</h1>
        <p className="text-muted-foreground">Reporting lines on this device. Not a live directory sync.</p>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No people on the chart" description="Add a row." />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className="border bg-card p-4 flex justify-between gap-4">
              <div>
                <p className="font-medium">{n.name}</p>
                <p className="text-sm text-muted-foreground">
                  {n.title} · reports to {n.reportsTo}
                </p>
              </div>
              <Button variant="ghost" onClick={() => persist(items.filter((x) => x.id !== n.id))}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button
        onClick={() =>
          persist([
            ...items,
            { id: crypto.randomUUID(), name: 'New hire', title: 'Role TBD', reportsTo: items[0]?.name || '—' },
          ])
        }
      >
        Add box
      </Button>
    </div>
  );
}
