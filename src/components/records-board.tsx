'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/empty-state';
import { useLocalCollection } from '@/hooks/use-local-collection';
import { appendAudit } from '@/lib/audit';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type Field = { key: string; label: string; type?: 'text' | 'number' | 'date' };

export function RecordsBoard<T extends { id: string }>({
  title,
  description,
  storeKey,
  seed,
  fields,
  createLabel,
}: {
  title: string;
  description: string;
  storeKey: string;
  seed: T[];
  fields: Field[];
  createLabel: string;
}) {
  const { items, ready, persist } = useLocalCollection<T>(storeKey, seed);
  const { user } = useAuth();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const add = () => {
    const row = { id: crypto.randomUUID(), ...draft } as T;
    persist([row, ...items]);
    appendAudit(user?.email || 'demo', `create:${storeKey}`, JSON.stringify(draft));
    setDraft({});
    toast.success(`${title}: record added on this device.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Stored in this browser (demo persistence). Refresh keeps the list. Not a payroll-grade ledger.
        </p>
      </div>

      <form
        className="grid gap-3 md:grid-cols-4 items-end border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type={f.type || 'text'}
              value={draft[f.key] || ''}
              onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              required
            />
          </div>
        ))}
        <Button type="submit">{createLabel}</Button>
      </form>

      {!ready ? (
        <div className="h-32 animate-pulse bg-muted" />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Add the first record with the form above." />
      ) : (
        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {fields.map((f) => (
                  <th key={f.key} className="text-left p-3 font-medium">
                    {f.label}
                  </th>
                ))}
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-t">
                  {fields.map((f) => (
                    <td key={f.key} className="p-3">
                      {String((row as Record<string, unknown>)[f.key] ?? '')}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setPendingDelete(row)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this record?</AlertDialogTitle>
            <AlertDialogDescription>
              It will disappear from this browser store. It is not deleted from Supabase unless this module is wired to the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                persist(items.filter((i) => i.id !== pendingDelete.id));
                appendAudit(user?.email || 'demo', `delete:${storeKey}`, pendingDelete.id);
                toast.success('Record removed from this device.');
                setPendingDelete(null);
              }}
            >
              Remove record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
