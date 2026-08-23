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
            <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>You're all caught up!</p>
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
                    <div key={action.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors gap-4">
                        <div className="flex gap-3 items-start">
                            <div className="mt-0.5">
                                {getIcon(action.source)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    {action.title}
                                    {action.priority === 'HIGH' && <Badge variant="destructive" className="h-5 text-[10px]">HIGH</Badge>}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{action.description}</p>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => router.push(action.actionUrl)} className="w-full sm:w-auto shrink-0">
                            {action.actionLabel}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
