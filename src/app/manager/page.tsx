'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Clock, AlertTriangle, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Good morning, Manager</h1>
                <p className="text-muted-foreground mt-1">Here is what needs your attention across your team today.</p>
            </div>

            {/* Top Action Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-orange-900">Pending Approvals</p>
                                <h3 className="text-3xl font-bold text-orange-700 mt-2">5</h3>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <Button variant="link" className="px-0 text-orange-700 mt-4" asChild>
                            <Link href="/manager/inbox">Review Inbox <ChevronRight className="h-4 w-4 ml-1" /></Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Team Attendance</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">11/12</h3>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
                            <span className="text-red-500 font-medium">1</span> absent today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overtime Alert</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">2</h3>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full text-red-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 text-red-600 flex items-center gap-1">
                            Approaching limit this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Roles</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">1</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <Button variant="link" className="px-0 text-blue-700 mt-4" asChild>
                            <Link href="/manager/hiring">View Pipeline <ChevronRight className="h-4 w-4 ml-1" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Priority Inbox Preview */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <CardTitle className="text-lg">Priority Inbox</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/manager/inbox">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {[
                                { id: 1, name: 'Sarah Chen', type: 'Annual Leave', date: 'Oct 15 - Oct 20', status: 'Pending', urgency: 'high' },
                                { id: 2, name: 'Marcus Johnson', type: 'Expense Claim', amount: '$450.00', status: 'Pending', urgency: 'normal' },
                                { id: 3, name: 'Elena Rodriguez', type: 'Overtime Request', hours: '4 hrs', status: 'Pending', urgency: 'normal' },
                            ].map((item) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-slate-100 text-slate-600">{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Requested {item.type} • {item.date || item.amount || item.hours}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Review</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Team Health Insights (AI Generated Mock) */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bot className="h-5 w-5 text-purple-600" />
                            Chief of Staff Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border shadow-sm text-sm border-orange-100 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" />
                            <div className="flex gap-2 items-start text-orange-900 font-medium mb-1">
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                                Flight Risk Detected
                            </div>
                            <p className="text-slate-600 pl-6">Marcus Johnson has worked 15% above capacity for 3 weeks and has skipped his last two 1:1s.</p>
                            <Button variant="link" size="sm" className="pl-6 h-auto py-1 mt-1 text-purple-700">Schedule 1:1</Button>
                        </div>

                        <div className="bg-white p-4 rounded-lg border shadow-sm text-sm">
                            <div className="flex gap-2 items-start font-medium mb-1 text-slate-800">
                                <TrendingUp className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                                Review Cycle Upcoming
                            </div>
                            <p className="text-slate-600 pl-6">Q3 Performance reviews open in 14 days. 3 team members lack verified Q3 goals.</p>
                            <Button variant="link" size="sm" className="pl-6 h-auto py-1 mt-1 text-purple-700" asChild>
                                <Link href="/manager/performance">View Goal Status</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
