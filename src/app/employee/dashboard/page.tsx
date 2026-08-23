'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActionCenter } from '@/components/employee/ActionCenter';
import { EmployeeContextService, EmployeeActionItem } from '@/lib/employee/domain';
import { Clock, Calendar, Briefcase, GraduationCap, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeDashboard() {
    const [actions, setActions] = useState<EmployeeActionItem[]>([]);
    const [schedule, setSchedule] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContext() {
            setLoading(true);
            const pendingActions = await EmployeeContextService.getPendingActions('emp-1');
            const todaySchedule = await EmployeeContextService.getTodaySchedule('emp-1');
            setActions(pendingActions);
            setSchedule(todaySchedule);
            setLoading(false);
        }
        fetchContext();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse md:col-span-1" />
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse md:col-span-2" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            {/* Header / Identity */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Good morning, Ravi</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        Senior Software Engineer <span className="text-border">•</span> Engineering
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2"><Clock className="h-4 w-4" /> Clock Out</Button>
                    <Button variant="default" className="gap-2"><Calendar className="h-4 w-4" /> Apply Leave</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Work Summary */}
                <Card className="md:col-span-1 border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Today's Schedule</h3>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-xl font-bold">{schedule?.shift}</span>
                                <Badge className="bg-green-100 text-green-700 border-green-200">Working</Badge>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-primary/10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Clock In</span>
                                <span className="font-medium">{schedule?.clockIn || '--:--'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Clock Out</span>
                                <span className="font-medium">{schedule?.clockOut || '--:--'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Center (Inbox) Preview */}
                <div className="md:col-span-2 space-y-4">
                    <ActionCenter actions={actions} />
                </div>
            </div>

            {/* Hub Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/employee/requests">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <span className="font-medium">My Requests</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/employee/career">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 text-purple-700">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <span className="font-medium">Career Path</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/employee/learning">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-orange-100 text-orange-700">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <span className="font-medium">Learning Hub</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/employee/ai">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-indigo-100 text-indigo-700">
                                    <span className="font-bold font-mono">AI</span>
                                </div>
                                <span className="font-medium">Workforce Copilot</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
