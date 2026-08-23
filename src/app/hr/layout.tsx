import React from 'react';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Inbox, 
    BarChart3, 
    Users, 
    Calendar,
    Settings,
    Shield
} from 'lucide-react';

export default function HRLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800">
                <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-white">
                    <Shield className="h-6 w-6 text-indigo-400" />
                    <span className="font-bold text-lg tracking-tight">HR Command</span>
                </div>
                <div className="p-4 flex-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Organization</div>
                    <nav className="space-y-1">
                        <Link href="/hr" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white bg-slate-800/50 hover:bg-slate-800 transition-colors">
                            <LayoutDashboard className="h-5 w-5 text-indigo-400" /> Executive Overview
                        </Link>
                        <Link href="/hr/operations" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                            <div className="flex items-center gap-3">
                                <Inbox className="h-5 w-5" /> Operations
                            </div>
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">12</span>
                        </Link>
                        <Link href="/hr/insights" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                            <BarChart3 className="h-5 w-5" /> Decisions & Insights
                        </Link>
                    </nav>

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-3">Directories</div>
                    <nav className="space-y-1">
                        <Link href="/hr/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors opacity-50 cursor-not-allowed">
                            <Users className="h-5 w-5" /> Employee Master
                        </Link>
                        <Link href="/hr/calendar" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors opacity-50 cursor-not-allowed">
                            <Calendar className="h-5 w-5" /> Org Calendar
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs border border-slate-600">
                            HR
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-white font-medium truncate">Sarah HRBP</div>
                            <div className="text-xs text-slate-500 truncate">Global View</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-400" />
                        <span className="font-bold">HR Command</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">HR</div>
                </header>

                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-400 border-t border-slate-800 flex justify-around p-2 pb-safe z-50">
                    <Link href="/hr" className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] text-white">
                        <LayoutDashboard className="h-6 w-6 mb-1 text-indigo-400" />
                        <span className="text-[10px] font-medium">Overview</span>
                    </Link>
                    <Link href="/hr/operations" className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] relative hover:text-white">
                        <Inbox className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Ops</span>
                        <span className="absolute top-1 right-2 bg-indigo-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-slate-900">12</span>
                    </Link>
                    <Link href="/hr/insights" className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] hover:text-white">
                        <BarChart3 className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Insights</span>
                    </Link>
                </nav>
            </div>

        </div>
    );
}
