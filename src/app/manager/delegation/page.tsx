'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, 
    Plus, 
    Calendar, 
    Shield, 
    ArrowRight,
    Clock,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerDelegationHub() {
    const delegations = [
        {
            id: 'DEL-104',
            delegate: 'Ravi Patel',
            role: 'Engineering Manager',
            status: 'Active',
            startDate: 'Aug 25, 2026',
            endDate: 'Aug 30, 2026',
            scope: 'All Direct Reports',
            permissions: ['Leave Approval', 'Expenses', 'Attendance'],
            denied: ['Compensation', 'Termination']
        },
        {
            id: 'DEL-089',
            delegate: 'Sarah Chen',
            role: 'Lead Developer',
            status: 'Expired',
            startDate: 'Jul 10, 2026',
            endDate: 'Jul 15, 2026',
            scope: 'Frontend Team',
            permissions: ['Leave Approval', 'Attendance'],
            denied: ['Compensation', 'Performance Reviews']
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delegation OS</h1>
                    <p className="text-muted-foreground mt-1">Manage temporary transfers of authority securely.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/manager/relationships">View Matrix</Link>
                    </Button>
                    <Button className="bg-slate-900" asChild>
                        <Link href="/manager/delegation/create"><Plus className="h-4 w-4 mr-2" /> New Delegation</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                
                {/* Info Panel */}
                <Card className="bg-blue-50/50 border-blue-100 h-fit">
                    <CardHeader className="pb-3 border-b border-blue-100">
                        <CardTitle className="text-sm uppercase tracking-wider text-blue-900 flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Security Principles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-sm text-slate-700">
                        <p>Delegations strictly follow the <strong>Intersection Principle</strong>:</p>
                        <ul className="list-disc list-inside space-y-2 ml-1">
                            <li>Cannot grant permissions you do not own.</li>
                            <li>Cannot be chained (your delegate cannot delegate your scope).</li>
                            <li>Automatically expire at 11:59 PM (local time) on the end date.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Delegation List */}
                <div className="md:col-span-2 space-y-4">
                    {delegations.map(del => (
                        <Card key={del.id} className={del.status === 'Active' ? 'border-primary shadow-sm' : 'opacity-75'}>
                            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-slate-50">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">Delegated to {del.delegate}</CardTitle>
                                        <Badge variant={del.status === 'Active' ? 'default' : 'secondary'}>{del.status}</Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" /> {del.startDate} <ArrowRight className="h-3 w-3 mx-1" /> {del.endDate}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm">Manage</Button>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-2">Granted Permissions</h4>
                                        <ul className="space-y-1">
                                            {del.permissions.map((p, i) => (
                                                <li key={i} className="flex items-center gap-2 text-slate-700">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-2">Explicitly Denied</h4>
                                        <ul className="space-y-1">
                                            {del.denied.map((p, i) => (
                                                <li key={i} className="flex items-center gap-2 text-slate-500">
                                                    <Shield className="h-4 w-4 text-red-300" /> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-slate-500 font-mono">
                                    <span>Scope: {del.scope}</span>
                                    <span>Ref: {del.id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>

        </div>
    );
}
