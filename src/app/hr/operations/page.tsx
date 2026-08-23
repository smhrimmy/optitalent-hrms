'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
    Clock, 
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Calendar,
    FileText,
    Users,
    Search
} from 'lucide-react';

// Mock data for HR Operations
const pendingApprovals = [
    { id: 1, type: 'Policy Exception', title: 'WFH Extension Request', requester: 'M. Chen (Eng)', date: 'Oct 12-25', status: 'Pending', risk: 'Low' },
    { id: 2, type: 'Payroll Override', title: 'Overtime Cap Exception', requester: 'S. Davis (Sales)', date: 'Current Pay Period', status: 'Pending', risk: 'High' }
];

const complianceAlerts = [
    { id: 101, title: 'I-9 Verification Pending', employee: 'J. Smith', daysLeft: 2, type: 'Critical' },
    { id: 102, title: 'Visa Expiration Warning', employee: 'A. Kumar', daysLeft: 28, type: 'Warning' }
];

export default function HrOperations() {
    const [actionDialog, setActionDialog] = useState<{ isOpen: boolean; actionType: string; itemId: number | null }>({ isOpen: false, actionType: '', itemId: null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAction = (type: string, id: number) => {
        setActionDialog({ isOpen: true, actionType: type, itemId: id });
    };

    const confirmAction = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setActionDialog({ isOpen: false, actionType: '', itemId: null });
            // In a real app, refresh data here
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">HR Operations</h1>
                <p className="text-muted-foreground mt-1">Manage org-wide approvals, compliance, and payroll exceptions.</p>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                <Button variant="secondary" className="bg-slate-100">All Tasks (12)</Button>
                <Button variant="ghost" className="text-slate-500">Approvals (2)</Button>
                <Button variant="ghost" className="text-slate-500 flex items-center gap-2">
                    Compliance <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">2</Badge>
                </Button>
                <Button variant="ghost" className="text-slate-500">Payroll Blocks (4)</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Org-Wide Approvals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" /> Pending HR Approvals
                        </CardTitle>
                        <CardDescription>Escalated requests requiring HRBP authorization.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {pendingApprovals.map(item => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs bg-slate-50">{item.type}</Badge>
                                            {item.risk === 'High' && <Badge variant="destructive" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">High Risk</Badge>}
                                        </div>
                                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {item.requester}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleAction('reject', item.id)}>
                                            <XCircle className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleAction('approve', item.id)}>
                                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Alerts */}
                <Card className="border-red-200">
                    <CardHeader className="bg-red-50 border-b border-red-100">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                            <ShieldAlert className="h-5 w-5" /> Compliance & Documents
                        </CardTitle>
                        <CardDescription className="text-red-700">Critical expiring documents and regulatory requirements.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {complianceAlerts.map(alert => (
                                <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex gap-3">
                                        {alert.type === 'Critical' ? (
                                            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                <span>{alert.employee}</span>
                                                <span>•</span>
                                                <span className={alert.type === 'Critical' ? 'text-red-600 font-medium' : 'text-orange-600 font-medium'}>
                                                    {alert.daysLeft} days remaining
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Confirmation Dialog */}
            <Dialog open={actionDialog.isOpen} onOpenChange={(open) => !open && !isSubmitting && setActionDialog({ isOpen: false, actionType: '', itemId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionDialog.actionType === 'approve' ? 'Approve Exception' : 'Reject Exception'}</DialogTitle>
                        <DialogDescription>
                            You are about to {actionDialog.actionType} this request. This action will be logged in the HR audit trail and may affect downstream payroll processing.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-slate-50 p-3 border rounded-md text-sm text-slate-600 mt-2">
                        <p><strong>Warning:</strong> Ensure this complies with organizational policy. The workflow engine will automatically notify the employee and their manager.</p>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setActionDialog({ isOpen: false, actionType: '', itemId: null })} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            className={actionDialog.actionType === 'approve' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'} 
                            onClick={confirmAction}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : `Confirm ${actionDialog.actionType === 'approve' ? 'Approval' : 'Rejection'}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
