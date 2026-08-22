'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { CommandSearch } from '@/components/command-search';
import NotificationBell from '@/components/NotificationBell';

export default function AppHeader() {
  const { searchTerm, setSearchTerm } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <button
          type="button"
          className="relative hidden md:flex"
          onClick={() => setOpen(true)}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            className="w-72 cursor-pointer rounded-full border bg-white py-2 pl-10 pr-16 dark:bg-card"
            placeholder="Search pages, buttons, edit…"
            type="text"
            value={searchTerm}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          className="rounded-full p-2 hover:bg-muted md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
      </div>
      <CommandSearch
        open={open}
        onOpenChange={setOpen}
        query={searchTerm}
        onQueryChange={setSearchTerm}
      />
    </header>
  );
}
