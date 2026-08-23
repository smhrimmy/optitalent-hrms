'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeRequest } from '@/lib/employee/domain';
import { RequestTimeline } from '@/components/employee/RequestTimeline';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployeeRequests() {
    const [requests, setRequests] = useState<EmployeeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContext() {
            setLoading(true);
            const reqs = await EmployeeContextService.getRecentRequests('emp-1');
            setRequests(reqs);
            setLoading(false);
        }
        fetchContext();
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
                    <p className="text-muted-foreground mt-1">
                        Track the status of your leave, expenses, and HR requests.
                    </p>
                </div>
                <Button className="gap-2 shrink-0 w-full md:w-auto">
                    <Plus className="h-4 w-4" /> New Request
                </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="active">Active & Pending</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-40 bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                    ) : requests.length > 0 ? (
                        requests.filter(r => ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'].includes(r.status)).map(req => (
                            <RequestTimeline key={req.id} request={req} />
                        ))
                    ) : (
                        <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                            No active requests.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                     {loading ? (
                        <div className="space-y-4">
                            <div className="h-40 bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                    ) : requests.length > 0 ? (
                        requests.filter(r => ['APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(r.status)).map(req => (
                            <RequestTimeline key={req.id} request={req} />
                        ))
                    ) : (
                        <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                            No request history.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
