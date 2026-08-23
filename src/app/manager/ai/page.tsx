'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Bot, 
    AlertTriangle, 
    Clock, 
    Target, 
    Briefcase, 
    Users,
    ChevronRight,
    MessageSquare,
    Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerAiHome() {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Bot className="h-8 w-8 text-purple-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chief of Staff</h1>
                        <p className="text-muted-foreground mt-1">Your daily team briefing and action orchestrator.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/manager/ai/chat"><MessageSquare className="h-4 w-4 mr-2" /> Ask a Question</Link>
                    </Button>
                    <Button className="bg-purple-700 hover:bg-purple-800" asChild>
                        <Link href="/manager/ai/actions"><Zap className="h-4 w-4 mr-2" /> Action Center</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Daily Brief */}
                <Card className="md:col-span-2 border-purple-100 shadow-sm">
                    <CardHeader className="bg-purple-50/50 border-b border-purple-100 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl text-purple-950 font-serif">TEAM BRIEF</CardTitle>
                            <Badge variant="outline" className="text-purple-700 border-purple-200">23 Aug 2026</Badge>
                        </div>
                        <CardDescription className="text-purple-700/80">3 things need your attention today.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            
                            {/* Attendance Alert */}
                            <div className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                    <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-sm">Attendance</h3>
                                </div>
                                <div className="pl-7">
                                    <p className="text-slate-900 font-medium">2 attendance exceptions</p>
                                    <p className="text-sm text-slate-500 mt-1">One affects this week's payroll (Missing punch for Alex Wong).</p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <Button variant="outline" size="sm" asChild><Link href="/manager/attendance">View Exception</Link></Button>
                                        <Button variant="link" size="sm" className="text-purple-600 px-0 h-auto">Explain impact &rarr;</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Alert */}
                            <div className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-sm">Performance</h3>
                                </div>
                                <div className="pl-7">
                                    <p className="text-slate-900 font-medium">1 goal at risk</p>
                                    <p className="text-sm text-slate-500 mt-1">The "API Migration" goal is 11 days from deadline with 40% progress.</p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <Button variant="outline" size="sm" asChild><Link href="/manager/performance">View Goal</Link></Button>
                                        <Button variant="link" size="sm" className="text-purple-600 px-0 h-auto">Recommend action &rarr;</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Capacity Alert */}
                            <div className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <ActivityIcon className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-sm">Capacity</h3>
                                </div>
                                <div className="pl-7">
                                    <p className="text-slate-900 font-medium">Engineering is projected at 112% capacity</p>
                                    <p className="text-sm text-slate-500 mt-1">Driven by unplanned scope expansion and 2 planned leaves next week.</p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <Button variant="outline" size="sm" asChild><Link href="/manager/capacity">View Capacity</Link></Button>
                                        <Button variant="link" size="sm" className="text-purple-600 px-0 h-auto">Run simulation &rarr;</Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Status Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Upcoming Decisions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y text-sm">
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="h-4 w-4 text-slate-400" />
                                        <span>1 Requisition Scorecard</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span>1 Upcoming 1:1</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-400" /> Proactive AI
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-300 mb-4">
                                Chief of Staff analyzes your team's Digital Twin daily, filtering noise and highlighting only metrics that require your intervention.
                            </p>
                            <Button variant="secondary" className="w-full text-slate-900 font-semibold" asChild>
                                <Link href="/manager/ai/actions">View 2 Pending Actions</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
