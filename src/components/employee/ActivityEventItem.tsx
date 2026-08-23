'use client';

import React from 'react';
import { EmployeeActivityEvent } from '@/lib/employee/domain';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, ShieldCheck, Briefcase, GraduationCap, Banknote, HeartPulse, Workflow, ArrowRight } from 'lucide-react';

interface ActivityEventItemProps {
    activity: EmployeeActivityEvent;
    isLast?: boolean;
}

export function ActivityEventItem({ activity, isLast = false }: ActivityEventItemProps) {
    const categoryConfig = {
        'Documents': { icon: <FileText className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 ring-blue-50' },
        'Requests': { icon: <Workflow className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700 ring-purple-50' },
        'Attendance': { icon: <Calendar className="h-4 w-4" />, color: 'bg-green-100 text-green-700 ring-green-50' },
        'Learning': { icon: <GraduationCap className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-700 ring-indigo-50' },
        'Performance': { icon: <Briefcase className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700 ring-orange-50' },
        'Payroll': { icon: <Banknote className="h-4 w-4" />, color: 'bg-emerald-100 text-emerald-700 ring-emerald-50' },
        'Benefits': { icon: <HeartPulse className="h-4 w-4" />, color: 'bg-rose-100 text-rose-700 ring-rose-50' },
        'Lifecycle': { icon: <ShieldCheck className="h-4 w-4" />, color: 'bg-amber-100 text-amber-700 ring-amber-50' },
        'Career': { icon: <ArrowRight className="h-4 w-4" />, color: 'bg-sky-100 text-sky-700 ring-sky-50' }
    };

    const config = categoryConfig[activity.category as keyof typeof categoryConfig] || categoryConfig['Documents'];

    return (
        <div className="relative pl-8 sm:pl-10 py-4 group">
            {/* Timeline connector */}
            {!isLast && (
                <div className="absolute left-[11px] sm:left-[15px] top-10 bottom-0 w-[2px] bg-border group-hover:bg-muted-foreground/20 transition-colors" />
            )}
            
            {/* Timeline node */}
            <div className={`absolute left-0 sm:left-1 top-5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ring-4 ${config.color}`}>
                <div className="scale-75 sm:scale-100">
                    {config.icon}
                </div>
            </div>

            <div className="bg-card hover:bg-muted/30 transition-colors border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activity.category}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-muted-foreground/20">
                                {activity.source}
                            </Badge>
                        </div>
                        <h4 className="font-medium text-base text-foreground">
                            {activity.title}
                        </h4>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap sm:mt-1 font-medium">
                        {new Date(activity.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                </p>

                {/* Detail View Trigger (Mock) */}
                <button className="mt-3 text-xs font-medium text-primary hover:underline flex items-center gap-1">
                    View Details <ArrowRight className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}
