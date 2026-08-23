'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Clock, Briefcase, GraduationCap, Plane } from 'lucide-react';
import Link from 'next/link';

// Mock Calendar Data
const currentMonthStr = "October 2026";
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simulating a sparse calendar state for a specific week
const mockEvents = [
    { id: 1, date: 15, employee: 'Sarah Chen', type: 'Leave', status: 'Pending', icon: Plane, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 2, date: 16, employee: 'Sarah Chen', type: 'Leave', status: 'Pending', icon: Plane, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 3, date: 17, employee: 'Sarah Chen', type: 'Leave', status: 'Pending', icon: Plane, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 4, date: 18, employee: 'Sarah Chen', type: 'Leave', status: 'Pending', icon: Plane, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 5, date: 19, employee: 'Sarah Chen', type: 'Leave', status: 'Pending', icon: Plane, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 6, date: 14, employee: 'David Kim', type: '1:1 Review', status: 'Scheduled', icon: Briefcase, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 7, date: 22, employee: 'Elena Rodriguez', type: 'Training', status: 'Scheduled', icon: GraduationCap, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 8, date: 28, title: 'Company Holiday', type: 'Holiday', status: 'Confirmed', icon: CalendarIcon, color: 'bg-slate-100 text-slate-800 border-slate-200' },
];

export default function ManagerCalendarPage() {
    
    // Simple calendar grid generation for demo purposes
    const generateDays = () => {
        const days = [];
        // Pad start of month
        for(let i=0; i<3; i++) days.push({ date: null });
        // Month days
        for(let i=1; i<=31; i++) {
            const dayEvents = mockEvents.filter(e => e.date === i);
            days.push({ date: i, events: dayEvents });
        }
        // Pad end of month
        while(days.length % 7 !== 0) days.push({ date: null });
        return days;
    };

    const days = generateDays();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor team availability, overlaps, and key events.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <div className="flex bg-slate-100 p-1 rounded-lg border">
                        <Button variant="ghost" size="sm" className="bg-white shadow-sm h-8">Month</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">Week</Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                        <h2 className="text-lg font-semibold min-w-[140px] text-center">{currentMonthStr}</h2>
                        <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    <Button variant="outline" size="sm">Today</Button>
                </CardHeader>
                <CardContent className="p-0">
                    
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b bg-slate-50/50">
                        {daysOfWeek.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 bg-slate-200 gap-px border-b">
                        {days.map((day, idx) => (
                            <div key={idx} className={`min-h-[120px] bg-white p-2 ${!day.date ? 'bg-slate-50/50' : ''}`}>
                                {day.date && (
                                    <>
                                        <div className={`text-sm font-medium mb-1 ${day.date === 15 ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                                            {day.date}
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            {day.events?.map((evt, i) => (
                                                <div key={i}>
                                                    {evt.status === 'Pending' ? (
                                                        // Link pending items to the inbox
                                                        <Link href="/manager/inbox">
                                                            <div className={`text-[10px] sm:text-xs p-1.5 rounded border truncate cursor-pointer hover:opacity-80 flex items-center gap-1 ${evt.color}`}>
                                                                <evt.icon className="h-3 w-3 shrink-0" />
                                                                <span className="truncate">{evt.employee || evt.title}</span>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className={`text-[10px] sm:text-xs p-1.5 rounded border truncate flex items-center gap-1 ${evt.color}`}>
                                                            <evt.icon className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">{evt.employee || evt.title}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-200"></div> Pending Leave</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200"></div> 1:1s / Reviews</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-100 border border-purple-200"></div> Training</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div> Holidays</div>
            </div>

        </div>
    );
}
