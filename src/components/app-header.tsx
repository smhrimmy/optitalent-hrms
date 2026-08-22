
'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Bell, Search, Inbox } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { dataQuery } from "@/lib/dataquery";
import { Badge } from "./ui/badge";

export default function AppHeader() {
  const { user } = useAuth();
  const pending = dataQuery.listApprovals().filter(a => a.status === 'Pending').length;
  const role = user?.role || 'employee';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden"/>
         <Button
            variant="outline"
            className="hidden md:inline-flex w-72 justify-between rounded-md text-muted-foreground font-normal"
            onClick={() => window.dispatchEvent(new Event('open-command'))}
          >
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Jump to people or modules</span>
            <kbd className="text-[10px] border rounded px-1.5 py-0.5">⌘K</kbd>
          </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-md relative" asChild>
          <Link href={`/${role}/inbox`} aria-label="Approvals inbox">
            <Inbox className="h-4 w-4" />
            {pending > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">{pending}</Badge>
            )}
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="rounded-md" aria-label="Notifications"><Bell className="h-4 w-4"/></Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
