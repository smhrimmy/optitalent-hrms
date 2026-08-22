'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/empty-state';
import { useDataQuery } from '@/hooks/use-dataquery';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export default function DirectoryPage() {
  const db = useDataQuery();
  const [q, setQ] = useState('');
  const delayed = useDebouncedValue(q, 200);
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;

  const rows = useMemo(() => {
    const term = delayed.trim().toLowerCase();
    if (!term) return db.employees.map(e => e.profile);
    return db.employees.map(e => e.profile).filter(p =>
      p.full_name.toLowerCase().includes(term) ||
      p.job_title.toLowerCase().includes(term) ||
      p.department.name.toLowerCase().includes(term)
    );
  }, [delayed, db.employees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Directory</h1>
        <p className="text-muted-foreground">Find anyone by name, role, or department. Search waits 200ms so typing stays smooth.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" value={q} onChange={e => setQ(e.target.value)} placeholder="Search people" aria-label="Search directory" />
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={Search} title="No people match that search" description="Try a first name, team, or job title. Clearing the box shows the full directory." actionLabel="Clear search" onAction={() => setQ('')} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map(p => (
            <Card key={p.id} className="cursor-pointer" onClick={() => router.push(`/${role}/employees/${p.employee_id}`)}>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar><AvatarImage src={p.profile_picture_url} /><AvatarFallback>{p.full_name[0]}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium text-sm">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">{p.job_title} · {p.department.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
