'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    XCircle, 
    MapPin, 
    Calendar,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// Mock Data representing the Output of the Time Engine & Payroll pre-processor
const mockExceptions = [
    {
        id: 'EXC-001',
        employee: 'David Kim',
        type: 'Missing Punch',
        priority: 'Critical',
        date: 'Today, Oct 15',
        details: 'Missing OUT punch. Scheduled end: 18:00.',
        calculationTrace: [
            { step: 'Schedule', value: '09:00 - 18:00' },
            { step: 'Actual IN', value: '08:55' },
            { step: 'Actual OUT', value: 'Missing', alert: true },
            { step: 'Payroll Impact', value: 'Blocks daily calculation', alert: true }
        ]
    },
    {
        id: 'EXC-002',
        employee: 'Marcus Johnson',
        type: 'Overtime',
        priority: 'High',
        date: 'Yesterday, Oct 14',
        details: '2h 17m unapproved overtime detected.',
        calculationTrace: [
            { step: 'Schedule', value: '09:00 - 18:00' },
            { step: 'Actual', value: '08:52 - 20:17' },
            { step: 'Approved Threshold', value: '30m' },
            { step: 'Calculated Overtime', value: '2h 17m', alert: true }
        ]
    },
    {
        id: 'EXC-003',
        employee: 'Sarah Chen',
        type: 'Location Anomaly',
        priority: 'Critical',
        date: 'Today, Oct 15',
        details: 'Punched IN outside authorized geofence.',
        calculationTrace: [
            { step: 'Expected Location', value: 'HQ - San Francisco' },
            { step: 'Actual Location', value: 'Coffee Shop IP (10km away)', alert: true },
            { step: 'Policy', value: 'Requires Manager Override', alert: true }
        ]
    },
    {
        id: 'EXC-004',
        employee: 'Elena Rodriguez',
        type: 'Late Arrival',
        priority: 'Normal',
        date: 'Today, Oct 15',
        details: 'Arrived 45m late.',
        calculationTrace: [
            { step: 'Schedule', value: '09:00 IN' },
            { step: 'Actual IN', value: '09:45', alert: true },
            { step: 'Grace Period', value: '15m' },
            { step: 'Late Minutes', value: '30m Deductible' }
        ]
    }
];

export default function AttendanceExceptionsPage() {
    const { toast } = useToast();
    const [exceptions, setExceptions] = useState(mockExceptions);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
        setExceptions(prev => prev.filter(e => e.id !== id));
        toast({
            title: `Exception ${action}`,
            description: `Payroll/Time workflow for ${id} has been updated.`,
        });
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Attendance & Exceptions</h1>
                    <p className="text-muted-foreground mt-1">
                        Review anomalies and approve actions that affect payroll and timekeeping.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                        <CheckCircle2 className="h-4 w-4" /> Bulk Approve Safe
                    </Button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <Users className="h-5 w-5 text-slate-500 mb-2" />
                        <h3 className="text-2xl font-bold text-slate-900">11/12</h3>
                        <p className="text-xs font-medium text-slate-500">Present Today</p>
                    </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
                        <h3 className="text-2xl font-bold text-red-700">2</h3>
                        <p className="text-xs font-medium text-red-600">Critical Exceptions</p>
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <Clock className="h-5 w-5 text-orange-500 mb-2" />
                        <h3 className="text-2xl font-bold text-orange-700">1</h3>
                        <p className="text-xs font-medium text-orange-600">Unapproved Overtime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                        <h3 className="text-2xl font-bold text-slate-900">100%</h3>
                        <p className="text-xs font-medium text-slate-500">Timesheet Compliance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Exceptions Queue */}
            <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold border-b pb-2">Needs Approval</h2>
                
                {exceptions.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 border rounded-xl border-dashed">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">All Clear</h3>
                        <p className="text-muted-foreground mt-1">No attendance exceptions require your review.</p>
                    </div>
                ) : (
                    exceptions.map((exc) => (
                        <Card key={exc.id} className={`overflow-hidden border-l-4 ${
                            exc.priority === 'Critical' ? 'border-l-red-500' : 
                            exc.priority === 'High' ? 'border-l-orange-500' : 'border-l-blue-500'
                        }`}>
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                
                                {/* Header / Employee Info */}
                                <div className="p-4 md:w-1/3 border-b md:border-b-0 md:border-r bg-slate-50/50 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="h-10 w-10 border shadow-sm">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                                                {exc.employee.split(' ').map(n=>n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{exc.employee}</h3>
                                            <p className="text-xs text-muted-foreground">{exc.date}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`w-fit mt-1 ${
                                        exc.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                        exc.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {exc.type}
                                    </Badge>
                                </div>

                                {/* Calculation Trace */}
                                <div className="p-4 md:flex-1">
                                    <div className="text-sm font-medium text-slate-900 mb-3">{exc.details}</div>
                                    <div className="bg-slate-50 rounded-md border p-3">
                                        <div className="text-[10px] font-semibold uppercase text-slate-500 mb-2 tracking-wider flex items-center justify-between">
                                            <span>Calculation Trace</span>
                                            <span className="text-slate-400 font-mono text-[9px]">{exc.id}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {exc.calculationTrace.map((trace, idx) => (
                                                <div key={idx} className="flex justify-between text-xs">
                                                    <span className="text-slate-500">{trace.step}</span>
                                                    <span className={`font-mono ${trace.alert ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                                                        {trace.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-4 bg-slate-50 border-t md:border-t-0 md:border-l md:w-48 flex flex-row md:flex-col gap-2 justify-center">
                                    <Button size="sm" className="flex-1 bg-slate-900 hover:bg-slate-800" onClick={() => handleAction(exc.id, 'Approved')}>
                                        Approve
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(exc.id, 'Rejected')}>
                                        Reject
                                    </Button>
                                    
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="sm" className="hidden md:flex mt-2 text-xs text-muted-foreground w-full" onClick={() => setSelectedEmployee(exc)}>
                                                View Employee <ChevronRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                                            <SheetHeader className="text-left pb-4 border-b">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 border shadow-sm">
                                                        <AvatarFallback className="bg-slate-100 text-slate-600 text-lg">
                                                            {exc.employee.split(' ').map(n=>n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <SheetTitle>{exc.employee}</SheetTitle>
                                                        <SheetDescription>Direct Report • Engineering</SheetDescription>
                                                    </div>
                                                </div>
                                            </SheetHeader>
                                            
                                            <div className="py-6 space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3">Attendance Trend (30 Days)</h4>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="bg-slate-50 p-3 rounded-lg border text-center">
                                                            <div className="text-xl font-bold text-slate-900">21</div>
                                                            <div className="text-[10px] uppercase text-slate-500 font-semibold mt-1">Present</div>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded-lg border text-center">
                                                            <div className="text-xl font-bold text-red-600">3</div>
                                                            <div className="text-[10px] uppercase text-slate-500 font-semibold mt-1">Late</div>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded-lg border text-center">
                                                            <div className="text-xl font-bold text-slate-900">4h</div>
                                                            <div className="text-[10px] uppercase text-slate-500 font-semibold mt-1">Overtime</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold mb-3 flex justify-between items-center">
                                                        Current Exception
                                                        <Badge variant="outline" className="bg-red-50 text-red-700">{exc.type}</Badge>
                                                    </h4>
                                                    <div className="bg-slate-50 rounded-md border p-3">
                                                        <div className="space-y-2">
                                                            {exc.calculationTrace.map((trace, idx) => (
                                                                <div key={idx} className="flex justify-between text-xs border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                                                                    <span className="text-slate-500">{trace.step}</span>
                                                                    <span className={`font-mono ${trace.alert ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                                                                        {trace.value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex gap-2">
                                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                                    <p>Approving this exception will immediately release the data block on the current payroll run.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t">
                                                <Button className="flex-1 bg-slate-900" onClick={() => handleAction(exc.id, 'Approved')}>Approve</Button>
                                                <Button variant="outline" className="flex-1 text-red-600" onClick={() => handleAction(exc.id, 'Rejected')}>Reject</Button>
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

        </div>
    );
}
