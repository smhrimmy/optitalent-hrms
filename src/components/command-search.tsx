'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuth } from '@/hooks/use-auth';
import { useNav } from '@/hooks/use-nav';
import {
  Bell,
  Clock,
  Edit3,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sun,
  Ticket,
  User,
  UserPlus,
  CalendarOff,
  LayoutDashboard,
} from 'lucide-react';

export function CommandSearch({
  open,
  onOpenChange,
  query,
  onQueryChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const router = useRouter();
  const { user, logout, setSearchTerm } = useAuth();
  const { setTheme } = useTheme();
  const role = user?.role || 'employee';
  const navItems = useNav(role);

  const go = (href: string) => {
    onOpenChange(false);
    onQueryChange('');
    setSearchTerm('');
    router.push(href);
  };

  const pages = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        path: `/${role}${item.href}`,
      })),
    [navItems, role]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages, buttons, options, edit…"
        value={query}
        onValueChange={onQueryChange}
      />
      <CommandList>
        <CommandEmpty>No matching action.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem value="page company dashboard" onSelect={() => go('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Company Dashboard
          </CommandItem>
          {pages.map((item) => (
            <CommandItem key={item.path} value={`page ${item.label}`} onSelect={() => go(item.path)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Buttons">
          <CommandItem value="button add employee new hire" onSelect={() => go(`/${role}/employees`)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </CommandItem>
          <CommandItem value="button new ticket helpdesk" onSelect={() => go(`/${role}/helpdesk`)}>
            <Ticket className="mr-2 h-4 w-4" />
            New Ticket
          </CommandItem>
          <CommandItem value="button apply leave request" onSelect={() => go(`/${role}/leaves`)}>
            <CalendarOff className="mr-2 h-4 w-4" />
            Apply Leave
          </CommandItem>
          <CommandItem value="button clock in attendance" onSelect={() => go(`/${role}/attendance`)}>
            <Clock className="mr-2 h-4 w-4" />
            Clock In / Out
          </CommandItem>
          <CommandItem value="action create job recruitment" onSelect={() => go(`/${role}/recruitment`)}>
            <Plus className="mr-2 h-4 w-4" />
            Create job
          </CommandItem>
          <CommandItem value="action run payroll" onSelect={() => go(`/${role}/payroll`)}>
            <Plus className="mr-2 h-4 w-4" />
            Run payroll
          </CommandItem>
          <CommandItem value="action security settings" onSelect={() => go(`/${role}/super-admin/security`)}>
            <Settings className="mr-2 h-4 w-4" />
            Open security settings
          </CommandItem>
          <CommandItem value="action expenses claim" onSelect={() => go(`/${role}/expenses`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add expense
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem value="edit profile my details" onSelect={() => go(`/${role}/profile`)}>
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </CommandItem>
          <CommandItem value="edit employees directory" onSelect={() => go(`/${role}/employees`)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Employees
          </CommandItem>
          <CommandItem value="edit settings options" onSelect={() => go(`/${role}/settings`)}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Options">
          <CommandItem value="option notifications bell" onSelect={() => go(`/${role}/dashboard`)}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </CommandItem>
          <CommandItem value="option theme light" onSelect={() => { setTheme('light'); onOpenChange(false); }}>
            <Sun className="mr-2 h-4 w-4" />
            Light theme
          </CommandItem>
          <CommandItem value="option theme dark" onSelect={() => { setTheme('dark'); onOpenChange(false); }}>
            <Moon className="mr-2 h-4 w-4" />
            Dark theme
          </CommandItem>
          <CommandItem
            value="option logout sign out"
            onSelect={() => {
              onOpenChange(false);
              void logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
