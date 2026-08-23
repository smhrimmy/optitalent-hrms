'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmployeeRequest } from '@/lib/employee/domain';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface RequestTimelineProps {
    request: EmployeeRequest;
}

export function RequestTimeline({ request }: RequestTimelineProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'COMPLETED':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'REJECTED':
            case 'CANCELLED':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'UNDER_REVIEW':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'COMPLETED':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'REJECTED':
            case 'CANCELLED':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <Badge variant="outline" className="mb-2">{request.type}</Badge>
                        <h3 className="text-lg font-semibold">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">ID: {request.id}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="relative pl-6 border-l-2 border-muted space-y-6">
                    {request.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                            <div className="absolute -left-[35px] bg-background rounded-full border-2 border-background p-0.5">
                                <div className="bg-muted/30 rounded-full p-1">
                                    {getStatusIcon(event.status)}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">{event.status.replace('_', ' ')}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(event.timestamp).toLocaleString()}
                                </p>
                                {event.note && (
                                    <div className="mt-2 text-sm bg-muted/30 p-2 rounded border">
                                        {event.note}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
