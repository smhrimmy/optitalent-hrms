'use client';

import React, { useState } from 'react';
import { EmployeeNotification } from '@/lib/employee/domain';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ShieldCheck, AlertCircle, RefreshCw, Bot, Bell, Clock, Briefcase, GraduationCap, Banknote, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
    notification: EmployeeNotification;
    onMarkRead?: (id: string) => void;
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
    const [isRead, setIsRead] = useState(notification.status === 'READ');

    const handleMarkRead = () => {
        setIsRead(true);
        if (onMarkRead) onMarkRead(notification.id);
    };

    const categoryConfig = {
        'DOCUMENT': { icon: <FileText className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
        'AI': { icon: <Bot className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
        'LEAVE': { icon: <Calendar className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
        'LEARNING': { icon: <GraduationCap className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800' },
        'PERFORMANCE': { icon: <Briefcase className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
        'PAYROLL': { icon: <Banknote className="h-4 w-4" />, color: 'bg-emerald-100 text-emerald-800' },
        'BENEFITS': { icon: <HeartPulse className="h-4 w-4" />, color: 'bg-rose-100 text-rose-800' },
        'DEFAULT': { icon: <Bell className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' }
    };

    const config = categoryConfig[notification.category as keyof typeof categoryConfig] || categoryConfig['DEFAULT'];

    return (
        <Card className={cn(
            "transition-all duration-200 relative overflow-hidden group",
            isRead ? "bg-muted/30 border-muted" : "bg-card border-l-4 border-l-primary shadow-sm"
        )}>
            {/* AI Background indicator if applicable */}
            {notification.isAI && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -z-10 pointer-events-none" />
            )}

            <CardContent className="p-4 sm:p-5">
                <div className="flex gap-4">
                    {/* Icon Column */}
                    <div className={cn(
                        "p-2.5 rounded-full shrink-0 h-fit transition-colors",
                        isRead ? "bg-muted text-muted-foreground" : config.color
                    )}>
                        {config.icon}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                            <h4 className={cn(
                                "font-semibold text-base truncate",
                                isRead ? "text-muted-foreground" : "text-foreground"
                            )}>
                                {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        
                        <p className={cn(
                            "text-sm leading-relaxed",
                            isRead ? "text-muted-foreground/80" : "text-muted-foreground"
                        )}>
                            {notification.message}
                        </p>

                        {/* AI Evidence Block */}
                        {notification.isAI && notification.aiEvidence && (
                            <div className="mt-2 bg-purple-50/50 border border-purple-100 rounded-md p-3 text-sm flex gap-2">
                                <Bot className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-purple-900 block mb-0.5 text-xs uppercase tracking-wider">Why am I seeing this?</span>
                                    <span className="text-purple-800/80 leading-snug">{notification.aiEvidence}</span>
                                </div>
                            </div>
                        )}

                        {/* Meta and Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="font-medium">{notification.source}</span>
                                {notification.priority === 'HIGH' && !isRead && (
                                    <Badge variant="destructive" className="h-5 text-[10px] uppercase">High Priority</Badge>
                                )}
                            </div>

                            <div className="flex gap-2 ml-auto">
                                {!isRead && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleMarkRead}
                                        className="h-8 text-xs hover:bg-muted"
                                    >
                                        Mark as read
                                    </Button>
                                )}
                                {notification.action && (
                                    <Button size="sm" className="h-8 text-xs shadow-none" asChild>
                                        <Link href={notification.action.href}>
                                            {notification.action.label}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
