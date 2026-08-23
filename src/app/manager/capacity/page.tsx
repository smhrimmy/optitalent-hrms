'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { 
    Users, 
    Activity, 
    AlertTriangle, 
    CheckCircle2, 
    ChevronRight, 
    TrendingUp,
    Briefcase,
    Bot,
    Play
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerCapacityDashboard() {
    const [simulateLeave, setSimulateLeave] = useState(0); // number of engineers on leave

    // Base capacity data
    const baseCapacity = {
        totalHeadcount: 12,
        availableHours: 480, // 40 hrs * 12
        committedHours: 410,
        leaveHours: 20
    };

    // Simulated impact
    const simulatedLeaveHours = simulateLeave * 40;
    const effectiveAvailable = baseCapacity.availableHours - baseCapacity.leaveHours - simulatedLeaveHours;
    const utilizationRate = Math.round((baseCapacity.committedHours / effectiveAvailable) * 100);

    const getHealthClassification = (rate: number) => {
        if (rate > 105) return { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle };
        if (rate > 95) return { label: 'Overloaded', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle };
        if (rate < 70) return { label: 'Underutilized', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Activity };
        return { label: 'Healthy', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 };
    };

    const health = getHealthClassification(utilizationRate);
    const HealthIcon = health.icon;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Capacity OS</h1>
                    <p className="text-muted-foreground mt-1">Workload health and scenario simulation.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/manager/skills">View Skills Matrix</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Executive Overview */}
                <Card className={`lg:col-span-2 border-2 ${health.border}`}>
                    <CardHeader className={`border-b ${health.bg}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <HealthIcon className={`h-5 w-5 ${health.color}`} />
                                    Workload Status: <span className={health.color}>{health.label}</span>
                                </CardTitle>
                                <CardDescription className="mt-1 text-slate-600">
                                    Based on available capacity minus committed project work and approved leave.
                                </CardDescription>
                            </div>
                            <h2 className={`text-4xl font-bold ${health.color}`}>{utilizationRate}%</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        
                        {/* Capacity Bar */}
                        <div>
                            <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                                <span>Committed Work: {baseCapacity.committedHours} hrs</span>
                                <span>Effective Capacity: {effectiveAvailable} hrs</span>
                            </div>
                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div 
                                    className={`h-full transition-all duration-500 ${utilizationRate > 100 ? 'bg-red-500' : utilizationRate > 95 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                                />
                                {utilizationRate > 100 && (
                                    <div className="h-full bg-red-800 opacity-50" style={{ width: `${utilizationRate - 100}%` }} />
                                )}
                            </div>
                        </div>

                        {/* Interactive Simulator */}
                        <div className="p-5 bg-slate-50 border rounded-xl space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-slate-500" /> Scenario Simulator
                            </h4>
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-600">
                                    <span>Simulate Engineers on Leave</span>
                                    <span className="font-bold text-slate-900">{simulateLeave}</span>
                                </div>
                                <Slider 
                                    value={[simulateLeave]} 
                                    onValueChange={(v) => setSimulateLeave(v[0])} 
                                    max={5} 
                                    step={1}
                                    className="my-4"
                                />
                                {simulateLeave > 0 && (
                                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800 flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <p>
                                            If {simulateLeave} engineers take leave, utilization rises to <strong>{utilizationRate}%</strong>. 
                                            This puts the <em>API Migration</em> project at risk of delay.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t flex justify-end">
                                <Button className="gap-2">
                                    <Play className="h-4 w-4" /> Run Detailed Simulation
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* AI / Context Side Panel */}
                <div className="space-y-6">
                    <Card className="bg-purple-50/50 border-purple-100">
                        <CardHeader className="pb-3 border-b border-purple-100">
                            <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                                <Bot className="h-5 w-5 text-purple-600" /> Capacity Intelligence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm text-slate-700">
                                <span className="font-semibold text-slate-900 block mb-1">Why are we over capacity?</span>
                                <strong>Reason:</strong> The "Payment Gateway" epic was unexpectedly expanded, consuming 40 unplanned hours this sprint.
                                <div className="mt-2 text-xs text-slate-500 italic">Evidence: Jira Epic #402 scope change.</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-sm text-slate-700">
                                <span className="font-semibold text-slate-900 block mb-1">Who can help?</span>
                                <strong>Recommendation:</strong> Reallocate Alex Wong from Maintenance to Payments.
                                <div className="mt-2 text-xs text-slate-500 italic">Evidence: Digital Twin shows Alex has verified PostgreSQL proficiency.</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Individual Employee Capacity Drill-down */}
            <h3 className="text-xl font-bold mt-8 mb-4">Team Drill-down</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { name: 'Sarah Chen', role: 'Senior Frontend', utilization: 110, status: 'Overloaded' },
                    { name: 'Marcus Johnson', role: 'Backend Dev', utilization: 92, status: 'Healthy' },
                    { name: 'Elena Rodriguez', role: 'UX Designer', utilization: 65, status: 'Underutilized' }
                ].map((emp, i) => (
                    <Card key={i} className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-slate-100 text-slate-600">{emp.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{emp.name}</h4>
                                    <p className="text-xs text-muted-foreground">{emp.role}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-bold ${emp.utilization > 100 ? 'text-orange-600' : emp.utilization < 70 ? 'text-blue-600' : 'text-green-600'}`}>
                                    {emp.utilization}%
                                </span>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{emp.status}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}
