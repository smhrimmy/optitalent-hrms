'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Inbox, Clock, FileText, User } from 'lucide-react';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/employee/dashboard', label: 'Home', icon: <Home className="h-5 w-5" /> },
        { href: '/employee/inbox', label: 'Inbox', icon: <Inbox className="h-5 w-5" /> },
        { href: '/employee/dashboard', label: 'Attendance', icon: <Clock className="h-5 w-5" /> }, // Keeping it linked to dashboard for now
        { href: '/employee/requests', label: 'Requests', icon: <FileText className="h-5 w-5" /> },
        { href: '/employee/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    ];

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* Main Content Area */}
            <main>
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-2 py-1 flex justify-between items-center pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors ${
                                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            <div className={`p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] mt-0.5">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
