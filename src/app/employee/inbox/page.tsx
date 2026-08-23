'use client';

import React, { useEffect, useState } from 'react';
import { ActionCenter } from '@/components/employee/ActionCenter';
import { EmployeeContextService, EmployeeActionItem } from '@/lib/employee/domain';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

export default function EmployeeInbox() {
    const [actions, setActions] = useState<EmployeeActionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContext() {
            setLoading(true);
            const pendingActions = await EmployeeContextService.getPendingActions('emp-1');
            setActions(pendingActions);
            setLoading(false);
        }
        fetchContext();
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                <p className="text-muted-foreground mt-1">
                    Your personal action center. Review and complete required tasks.
                </p>
            </div>

            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tasks..." className="pl-8" />
                </div>
                <Button variant="outline" className="shrink-0 gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            ) : (
                <ActionCenter actions={actions} />
            )}
        </div>
    );
}
