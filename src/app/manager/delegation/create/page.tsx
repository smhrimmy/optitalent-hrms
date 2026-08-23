'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
    Shield, 
    Calendar,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateDelegation() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            router.push('/manager/delegation');
        }, 800);
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
            
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/manager/delegation"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Delegation</h1>
                    <p className="text-muted-foreground text-sm">Transfer specific authorities while you are away.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                
                <Card>
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" /> Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="delegate">Delegate To</Label>
                                <Input id="delegate" placeholder="Search colleague..." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scope">Employee Scope</Label>
                                <select id="scope" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option>All Direct Reports</option>
                                    <option>Engineering Team Only</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start">Start Date</Label>
                                <Input id="start" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end">End Date</Label>
                                <Input id="end" type="date" required />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b bg-slate-50">
                        <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" /> Permissions</CardTitle>
                        <CardDescription>Select which specific authorities to transfer. You cannot grant permissions you do not own.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-slate-900">Standard Approvals</h4>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Leave & Attendance</Label>
                                    <p className="text-sm text-muted-foreground">Approve PTO, sick leave, and missing punches.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Expense Approvals</Label>
                                    <p className="text-sm text-muted-foreground">Approve team expense reports.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold text-sm text-slate-900">Sensitive Actions</h4>
                            <div className="flex items-center justify-between opacity-50">
                                <div className="space-y-0.5 flex items-center gap-2">
                                    <div>
                                        <Label>Compensation & Payroll</Label>
                                        <p className="text-sm text-muted-foreground">Approve salary changes or finalize payroll.</p>
                                    </div>
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                </div>
                                <Switch disabled checked={false} />
                            </div>
                            <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                                This permission requires explicit HR authorization and cannot be self-delegated.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="bg-slate-900">
                        {submitting ? 'Creating...' : 'Create Delegation'}
                    </Button>
                </div>
            </form>

        </div>
    );
}
