
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ApplyLeaveDialog from '@/components/leaves/apply-leave-dialog';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { dataQuery, type LeaveType } from '@/lib/dataquery';
import { Button } from '@/components/ui/button';

type LeaveRequest = {
    id: string;
    type: string;
    from: string;
    to: string;
    days: number;
    status: string;
    employee_name?: string;
};

export default function LeavesPage() {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Default balances if not found
    const [balances, setBalances] = useState([
        { type: 'Sick Leave', balance: 7, used: 0 },
        { type: 'Casual Leave', balance: 12, used: 0 },
        { type: 'Paid Time Off', balance: 20, used: 0 },
    ]);

    useEffect(() => {
        fetchLeaveData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.profile.id]);

    const fetchLeaveData = async () => {
        setLoading(true);
        try {
            const employeeId = user?.profile.id;
            const remoteUser = (await supabase.auth.getUser()).data.user;

            if (remoteUser) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('tenant_id, employees(id)')
                    .eq('id', remoteUser.id)
                    .single();

                if (userData?.tenant_id) {
                    const empId = (userData as any).employees?.[0]?.id;
                    let query = supabase
                        .from('leave_requests')
                        .select('*')
                        .eq('tenant_id', userData.tenant_id)
                        .order('created_at', { ascending: false });
                    if (empId && !['admin', 'hr', 'manager'].includes(user?.role || '')) {
                        query = query.eq('employee_id', empId);
                    }
                    const { data: requestsData, error: requestsError } = await query;
                    if (!requestsError && requestsData) {
                        const mappedRequests = requestsData.map((r: any) => ({
                            id: r.id,
                            type: r.leave_type,
                            from: r.start_date,
                            to: r.end_date,
                            days: Math.ceil((new Date(r.end_date).getTime() - new Date(r.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1,
                            status: r.status,
                            employee_name: r.employee_name,
                        }));
                        setRequests(mappedRequests);
                        if (employeeId) {
                            const bals = dataQuery.leaveBalances(employeeId);
                            setBalances(bals.map(b => ({ type: b.type, balance: b.balance, used: b.used })));
                        }
                        setLoading(false);
                        return;
                    }
                }
            }

            const isApprover = ['admin', 'hr', 'manager', 'team-leader'].includes(user?.role || '');
            const rows = isApprover
                ? dataQuery.listLeaveRequests()
                : dataQuery.listLeaveRequests(employeeId);
            setRequests(rows.map(r => ({
                id: r.id,
                type: r.leave_type,
                from: r.start_date,
                to: r.end_date,
                days: r.days,
                status: r.status,
                employee_name: r.employee_name,
            })));
            if (employeeId) {
                const bals = dataQuery.leaveBalances(employeeId);
                setBalances(bals.map(b => ({ type: b.type, balance: b.balance, used: b.used })));
            }
        } catch (error: any) {
            console.error("Error fetching leaves:", error);
            toast({ title: "Error", description: "Failed to load leave data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleApplyLeave = async (formData: FormData): Promise<{success: boolean, message?: string}> => {
        const fromDate = formData.get('from-date') as string;
        const toDate = formData.get('to-date') as string;
        const type = formData.get('leave-type') as string;
        const reason = formData.get('reason') as string || '';
        
        try {
            if (!user) throw new Error("Not authenticated");
            dataQuery.applyLeave({
                employee_id: user.profile.id,
                employee_name: user.profile.full_name,
                leave_type: type as LeaveType,
                start_date: fromDate,
                end_date: toDate,
                reason,
            });

            const { data: { user: remote } } = await supabase.auth.getUser();
            if (remote) {
             const { data: userData } = await supabase
                .from('users')
                .select('tenant_id, employees(id)')
                .eq('id', remote.id)
                .single();
            
            if (userData?.tenant_id && (userData as any).employees?.[0]?.id) {
            await supabase.from('leave_requests').insert({
                tenant_id: userData.tenant_id,
                employee_id: (userData as any).employees[0].id,
                leave_type: type,
                start_date: fromDate,
                end_date: toDate,
                reason: reason,
                status: 'Pending'
            });
            }
            }

            fetchLeaveData();
            return { success: true };

        } catch (error: any) {
             toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
             return { success: false, message: error.message };
        }
    };

    const isApprover = ['admin', 'hr', 'manager', 'team-leader'].includes(user?.role || '');

    const handleDecision = (id: string, status: 'Approved' | 'Rejected') => {
        dataQuery.updateLeaveStatus(id, status);
        fetchLeaveData();
        toast({ title: `Request ${status}`, description: `Leave request has been ${status.toLowerCase()}.` });
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
                    {balances.map(balance => (
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
                                    style={{ width: `${(balance.balance / (balance.balance + balance.used)) * 100}%` }} 
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{balance.used} days used</p>
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
                                {isApprover && <TableHead>Employee</TableHead>}
                                <TableHead>Type</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Status</TableHead>
                                {isApprover && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(request => (
                                <TableRow key={request.id}>
                                    {isApprover && <TableCell>{request.employee_name}</TableCell>}
                                    <TableCell className="font-medium">{request.type}</TableCell>
                                    <TableCell>{request.from}</TableCell>
                                    <TableCell>{request.to}</TableCell>
                                    <TableCell>{request.days}</TableCell>
                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                    {isApprover && (
                                        <TableCell className="text-right space-x-2">
                                            {request.status === 'Pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => handleDecision(request.id, 'Approved')}>Approve</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDecision(request.id, 'Rejected')}>Reject</Button>
                                                </>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
