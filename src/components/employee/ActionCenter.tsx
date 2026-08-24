'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, CheckSquare, Clock } from 'lucide-react';
import { EmployeeActionItem } from '@/lib/employee/domain';
import { useRouter } from 'next/navigation';

interface ActionCenterProps {
    actions: EmployeeActionItem[];
}

export function ActionCenter({ actions }: ActionCenterProps) {
    const router = useRouter();

    const getIcon = (source: string) => {
        switch (source) {
            case 'HR': return <FileText className="h-5 w-5 text-blue-500" />;
            case 'COMPLIANCE': return <AlertCircle className="h-5 w-5 text-orange-500" />;
            case 'MANAGER': return <CheckSquare className="h-5 w-5 text-green-500" />;
            default: return <Clock className="h-5 w-5 text-muted-foreground" />;
        }
    };

    if (actions.length === 0) {
        return (
            <Card className="border-dashed border-2 bg-muted/10">
                <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <CheckSquare className="h-8 w-8 opacity-50" />
                    </div>
                    <h3 className="font-medium text-lg text-foreground mb-1">Inbox Zero</h3>
                    <p className="text-sm max-w-sm">You're all caught up! No pending approvals or required actions at this time.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    Action Center
                    <Badge variant="secondary" className="bg-primary/10 text-primary">{actions.length} pending</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {actions.map(action => (
                    <div key={action.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors gap-4">
                        <div className="flex gap-3 items-start w-full">
                            <div className="mt-0.5 shrink-0">
                                {getIcon(action.source)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm flex flex-wrap items-center gap-2 leading-tight">
                                    <span className="truncate">{action.title}</span>
                                    {action.priority === 'HIGH' && <Badge variant="destructive" className="h-5 text-[10px]">HIGH</Badge>}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                            </div>
                        </div>
                        <Button 
                            variant="default"
                            onClick={() => router.push(action.actionUrl)} 
                            className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-0 touch-manipulation"
                        >
                            {action.actionLabel}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
