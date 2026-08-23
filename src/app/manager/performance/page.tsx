'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Target, AlertCircle, CheckCircle2, MessageSquare, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ManagerPerformanceDashboard() {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance OS</h1>
                    <p className="text-muted-foreground mt-1">Continuous performance, goals, and feedback tracking.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/manager/one-on-ones">Go to 1:1 Workspace</Link>
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Team Goals on Track</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">78%</h3>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <Target className="h-5 w-5" />
                            </div>
                        </div>
                        <Progress value={78} className="h-1.5 mt-4 bg-slate-100 [&>div]:bg-green-500" />
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-orange-800">At-Risk Goals</p>
                                <h3 className="text-3xl font-bold text-orange-700 mt-2">3</h3>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-orange-700 mt-4 font-medium">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Verified Evidence</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">12</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">Linked to Digital Twin this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Upcoming 1:1s</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">4</h3>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">This week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Team Roster with Performance Context */}
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg">Team Performance Context</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {[
                                { id: 'emp-1', name: 'Sarah Chen', role: 'Senior Frontend Engineer', goals: 4, atRisk: 0, feedback: 2, next1on1: 'Tomorrow' },
                                { id: 'emp-2', name: 'Marcus Johnson', role: 'Backend Developer', goals: 3, atRisk: 2, feedback: 0, next1on1: 'Overdue (3 days)' },
                                { id: 'emp-3', name: 'Elena Rodriguez', role: 'UX Designer', goals: 5, atRisk: 1, feedback: 4, next1on1: 'Thursday' },
                            ].map(emp => (
                                <Link href={`/manager/performance/${emp.id}`} key={emp.id} className="block p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-slate-100 text-slate-600">{emp.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{emp.name}</p>
                                                <p className="text-sm text-muted-foreground">{emp.role}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Goals</p>
                                            <p className="text-sm font-medium mt-0.5">
                                                {emp.goals} active
                                                {emp.atRisk > 0 && <span className="text-orange-600 ml-2">({emp.atRisk} at risk)</span>}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Recent Feedback</p>
                                            <p className="text-sm font-medium mt-0.5">{emp.feedback} items</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Next 1:1</p>
                                            <p className={`text-sm font-medium mt-0.5 ${emp.next1on1.includes('Overdue') ? 'text-red-600' : ''}`}>
                                                {emp.next1on1}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Side Context (AI + Review Cycle) */}
                <div className="space-y-6">
                    {/* Review Cycle Widget */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Review Cycle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-900">Q3 Performance Review</h4>
                                <p className="text-sm text-slate-500 mt-1">Self-reviews open in 14 days.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Goal Verification</span>
                                    <span className="font-medium">10/12</span>
                                </div>
                                <Progress value={85} className="h-1.5" />
                                <p className="text-xs text-slate-500 pt-1">Ensure all team goals have linked Digital Twin evidence before cycle launch.</p>
                            </div>
                            <Button className="w-full" variant="outline">View Cycle Setup</Button>
                        </CardContent>
                    </Card>

                    {/* AI Chief of Staff widget */}
                    <Card className="bg-purple-50/50 border-purple-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                                <Briefcase className="h-5 w-5 text-purple-600" />
                                Chief of Staff
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                                <span className="font-semibold text-slate-900">Marcus Johnson</span> has 2 goals at risk and missed his last 1:1. Recommended action: Intervene on "API Migration" goal.
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm">
                                <span className="font-semibold text-slate-900">Sarah Chen</span> received exceptional peer feedback. Consider nominating for Q3 Tech Lead track.
                            </div>
                            <Button variant="link" className="px-0 text-purple-700 h-auto py-1">Ask AI about team performance &rarr;</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
