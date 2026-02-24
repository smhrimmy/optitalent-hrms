
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ApplyLeaveDialog from '@/components/leaves/apply-leave-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Mock data - In a real app, this would be fetched
const initialLeaveRequests = [
    { id: 'LR-001', type: 'Sick Leave', from: '2025-07-10', to: '2025-07-10', days: 1, status: 'Approved' },
    { id: 'LR-002', type: 'Paid Time Off', from: '2025-08-01', to: '2025-08-05', days: 5, status: 'Pending' },
    { id: 'LR-003', type: 'Work From Home', from: '2025-07-20', to: '2025-07-20', days: 1, status: 'Rejected' },
];

const leaveBalances = [
    { type: 'Sick Leave', balance: 8 },
    { type: 'Casual Leave', balance: 10 },
    { type: 'Paid Time Off', balance: 14.5 },
];

type LeaveRequest = typeof initialLeaveRequests[0];

export default function LeavesPage() {
    const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
    const { user } = useAuth();
    const { toast } = useToast();

    const handleApplyLeave = async (formData: FormData): Promise<{success: boolean, message?: string}> => {
        const fromDate = new Date(formData.get('from-date') as string);
        const toDate = new Date(formData.get('to-date') as string);
        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const newRequest: LeaveRequest = {
            id: `LR-${String(requests.length + 1).padStart(3, '0')}`,
            type: formData.get('leave-type') as LeaveRequest['type'],
            from: formData.get('from-date') as string,
            to: formData.get('to-date') as string,
            days: diffDays,
            status: 'Pending',
        };

        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        
        setRequests(prev => [newRequest, ...prev]);

        return { success: true };
    };
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved': return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
            case 'Pending': return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
            case 'Rejected': return <Badge variant="destructive">{status}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Leave Management</h1>
                    <p className="text-muted-foreground">Apply for time off and track your leave history.</p>
                </div>
                <ApplyLeaveDialog action={handleApplyLeave} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Leave Balances</CardTitle>
                    <CardDescription>Your remaining leave balance for the year.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {leaveBalances.map(balance => (
                        <div key={balance.type} className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">{balance.type}</span>
                                <span className="text-xs text-muted-foreground">
                                    {balance.balance}
                                    <span className="text-muted-foreground/60"> remaining</span>
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${(balance.balance / 20) * 100}%` }} 
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{20 - balance.balance} days used</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Leave Requests</CardTitle>
                    <CardDescription>A history of all your submitted leave requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(request => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.type}</TableCell>
                                    <TableCell>{request.from}</TableCell>
                                    <TableCell>{request.to}</TableCell>
                                    <TableCell>{request.days}</TableCell>
                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
