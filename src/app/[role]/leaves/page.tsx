
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

type LeaveRequest = {
    id: string;
    type: string;
    from: string;
    to: string;
    days: number;
    status: string;
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
    }, []);

    const fetchLeaveData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Employee ID & Tenant ID
            const { data: userData } = await supabase
                .from('users')
                .select('tenant_id, employees(id)')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id) return;
            const employeeId = userData.employees?.[0]?.id;

            // 2. Fetch Requests
            let query = supabase
                .from('leave_requests')
                .select('*')
                .eq('tenant_id', userData.tenant_id)
                .order('created_at', { ascending: false });

            // If not admin/hr, filter by own requests
            // For now, let's assume the RLS handles filtering, but we should also filter in query for performance
            // However, the page seems to be "My Leave Requests", so we should filter by employee_id if we have it.
            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            const { data: requestsData, error: requestsError } = await query;
            
            if (requestsError) throw requestsError;

            if (requestsData) {
                const mappedRequests = requestsData.map((r: any) => ({
                    id: r.id,
                    type: r.leave_type,
                    from: r.start_date,
                    to: r.end_date,
                    days: Math.ceil((new Date(r.end_date).getTime() - new Date(r.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1,
                    status: r.status
                }));
                setRequests(mappedRequests);
                
                // 3. Calculate Used Balances from Requests (Client-side aggregation for now)
                // In a real app, we'd query 'leave_balances' table, but let's aggregate for simplicity and "snap" feel
                const used = {
                    'Sick Leave': 0,
                    'Casual Leave': 0,
                    'Paid Time Off': 0
                };
                
                mappedRequests.forEach(r => {
                    if (r.status === 'Approved' && used[r.type as keyof typeof used] !== undefined) {
                        used[r.type as keyof typeof used] += r.days;
                    }
                });

                setBalances(prev => prev.map(b => ({
                    ...b,
                    used: used[b.type as keyof typeof used] || 0,
                    balance: (b.type === 'Sick Leave' ? 7 : b.type === 'Casual Leave' ? 12 : 20) - (used[b.type as keyof typeof used] || 0)
                })));
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
        const reason = formData.get('reason') as string || ''; // Assuming dialog has reason field or we add it
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

             const { data: userData } = await supabase
                .from('users')
                .select('tenant_id, employees(id)')
                .eq('id', user.id)
                .single();
            
            if (!userData?.tenant_id || !userData.employees?.[0]?.id) {
                throw new Error("Employee record not found.");
            }

            const { error } = await supabase.from('leave_requests').insert({
                tenant_id: userData.tenant_id,
                employee_id: userData.employees[0].id,
                leave_type: type,
                start_date: fromDate,
                end_date: toDate,
                reason: reason,
                status: 'Pending'
            });

            if (error) throw error;

            toast({ title: "Request Submitted", description: "Your leave request has been sent for approval." });
            fetchLeaveData(); // Refresh list
            return { success: true };

        } catch (error: any) {
             toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
             return { success: false, message: error.message };
        }
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
