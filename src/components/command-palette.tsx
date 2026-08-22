'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { navConfig } from '@/hooks/use-nav';
import { dataQuery } from '@/lib/dataquery';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const role = user?.role || 'employee';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    const openCmd = () => setOpen(true);
    window.addEventListener('open-command', openCmd);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command', openCmd);
    };
  }, []);

  const pages = navConfig[role] || navConfig.employee;
  const people = dataQuery.listEmployees().slice(0, 12);

  const go = (href: string) => {
    setOpen(false);
    router.push(`/${role}${href}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a person, page, or approval…" />
      <CommandList>
        <CommandEmpty>No match. Try a name or module.</CommandEmpty>
        <CommandGroup heading="Workforce OS">
          {[
            ['People OS', '/command-center'],
            ['Digital twin', '/digital-twin'],
            ['Simulator', '/simulator'],
            ['Why engine', '/why'],
            ['Chief of Staff', '/ai-tools/chatbot'],
          ].map(([label, href]) => (
            <CommandItem key={href} onSelect={() => go(href)}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.href} onSelect={() => go(p.href)}>
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="People">
          {people.map((p) => (
            <CommandItem key={p.id} onSelect={() => go(`/employees/${p.employee_id}`)}>
              {p.full_name} · {p.job_title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
