'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Users, 
    Inbox, 
    Calendar, 
    Clock, 
    Target, 
    UserPlus, 
    GraduationCap, 
    Bot, 
    ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { name: 'Dashboard', href: '/manager', icon: Users },
    { name: 'Inbox', href: '/manager/inbox', icon: Inbox, badge: '5' },
    { name: 'My Team', href: '/manager/team', icon: Users },
    { name: 'Calendar', href: '/manager/calendar', icon: Calendar },
    { name: 'Attendance', href: '/manager/attendance', icon: Clock },
    { name: 'Performance', href: '/manager/performance', icon: Target },
    { name: 'Hiring', href: '/manager/hiring', icon: UserPlus },
    { name: 'Skills & Capacity', href: '/manager/skills', icon: GraduationCap },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-white sticky top-0 h-screen overflow-y-auto shrink-0">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg text-slate-800 tracking-tight">Manager OS</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-3 w-3 text-orange-500" />
                        Scoped to Direct Reports
                    </p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/manager' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.name} href={item.href} className="block">
                                <div className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    isActive 
                                        ? "bg-slate-100 text-slate-900" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-slate-900" : "text-slate-400")} />
                                        {item.name}
                                    </div>
                                    {item.badge && (
                                        <span className="bg-orange-100 text-orange-700 py-0.5 px-2 rounded-full text-xs font-semibold">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border-purple-200" asChild>
                        <Link href="/manager/ai">
                            <Bot className="h-4 w-4" />
                            AI Assistant
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden min-h-screen relative">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50 flex items-center justify-around h-16 px-2 pb-safe">
                {[
                    { name: 'Dashboard', href: '/manager', icon: Users },
                    { name: 'Inbox', href: '/manager/inbox', icon: Inbox, badge: true },
                    { name: 'Team', href: '/manager/team', icon: Users },
                    { name: 'Actions', href: '#', icon: Bot }, // Temporary placeholder for mobile actions/AI
                ].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} className="relative flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary">
                            <div className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-colors",
                                isActive ? "text-primary" : ""
                            )}>
                                <div className="relative">
                                    <item.icon className="h-5 w-5 mb-1" />
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
