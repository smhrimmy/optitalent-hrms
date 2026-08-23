'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, 
    Clock, 
    Briefcase,
    TrendingUp,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Building2,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function ManagerHiringDashboard() {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hiring & Recruiting OS</h1>
                    <p className="text-muted-foreground mt-1">Manage open requisitions and candidate pipelines.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
                    <Briefcase className="h-4 w-4" /> Request New Headcount
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <Briefcase className="h-5 w-5 text-slate-500 mb-2" />
                        <h3 className="text-2xl font-bold text-slate-900">3</h3>
                        <p className="text-xs font-medium text-slate-500">Open Requisitions</p>
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <AlertCircle className="h-5 w-5 text-orange-500 mb-2" />
                        <h3 className="text-2xl font-bold text-orange-700">5</h3>
                        <p className="text-xs font-medium text-orange-600">Action Required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <Users className="h-5 w-5 text-slate-500 mb-2" />
                        <h3 className="text-2xl font-bold text-slate-900">12</h3>
                        <p className="text-xs font-medium text-slate-500">Active Candidates</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <Clock className="h-5 w-5 text-slate-500 mb-2" />
                        <h3 className="text-2xl font-bold text-slate-900">32d</h3>
                        <p className="text-xs font-medium text-slate-500">Avg Time-to-Hire</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Active Requisitions */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Active Requisitions</h2>
                    
                    {[
                        { id: 'REQ-042', role: 'Senior Frontend Engineer', type: 'Growth', candidates: 8, interviews: 2, daysOpen: 14 },
                        { id: 'REQ-045', role: 'UX Researcher', type: 'Backfill', candidates: 4, interviews: 0, daysOpen: 4 },
                        { id: 'REQ-050', role: 'Engineering Manager', type: 'Growth', candidates: 0, interviews: 0, daysOpen: 1 }
                    ].map(req => (
                        <Card key={req.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <Link href={`/manager/hiring/${req.id}`} className="block p-4 sm:p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                                {req.role}
                                                <Badge variant="outline" className={req.type === 'Growth' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                                                    {req.type}
                                                </Badge>
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-mono mt-1">{req.id} • Opened {req.daysOpen} days ago</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-slate-500">Pipeline</p>
                                            <p className="font-medium text-slate-900 mt-0.5">{req.candidates} Active</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-slate-500">Interviews</p>
                                            <p className="font-medium text-slate-900 mt-0.5">{req.interviews} Scheduled</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-slate-500">Workforce Plan</p>
                                            <p className="font-medium text-green-700 mt-0.5 flex items-center gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* To-Do & Context */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b bg-slate-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Action Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                <div className="p-4 hover:bg-slate-50 transition-colors">
                                    <Badge className="mb-2 bg-orange-100 text-orange-800 hover:bg-orange-100">Scorecard Due</Badge>
                                    <p className="text-sm font-medium text-slate-900">Complete interview scorecard for Alex Rivera</p>
                                    <p className="text-xs text-muted-foreground mt-1">Senior Frontend Engineer role</p>
                                    <Button variant="link" className="px-0 h-auto py-1 mt-2 text-primary">Open Scorecard &rarr;</Button>
                                </div>
                                <div className="p-4 hover:bg-slate-50 transition-colors">
                                    <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Review Required</Badge>
                                    <p className="text-sm font-medium text-slate-900">3 new candidates passed Recruiter Screen</p>
                                    <p className="text-xs text-muted-foreground mt-1">UX Researcher role</p>
                                    <Button variant="link" className="px-0 h-auto py-1 mt-2 text-primary">Review Pipeline &rarr;</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Workforce Plan Linkage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm text-slate-700 space-y-4">
                            <p>
                                Your current open requisitions align with the approved Q3 Workforce Growth plan for the Engineering department. 
                            </p>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Headcount Capacity</span>
                                    <span>21 / 24</span>
                                </div>
                                <Progress value={87.5} className="h-1.5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
