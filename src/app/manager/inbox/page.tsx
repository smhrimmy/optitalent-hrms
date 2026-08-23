'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, AlertTriangle, MessageSquare, CornerUpRight, Clock, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock Approval Task Data
const mockTasks = [
    {
        id: 'REQ-101',
        employee: 'Sarah Chen',
        type: 'Annual Leave',
        category: 'Leave',
        details: 'Oct 15 - Oct 20 (5 days)',
        submitted: '2 hours ago',
        sla: 'Due in 22 hrs',
        risk: 'Low',
        riskDetails: 'Team capacity remains at 85% during this period.',
        priority: 'Normal',
        status: 'Pending',
    },
    {
        id: 'REQ-102',
        employee: 'Marcus Johnson',
        type: 'Overtime Request',
        category: 'Attendance',
        details: '4 hours on Saturday for Release prep.',
        submitted: '4 hours ago',
        sla: 'Due in 20 hrs',
        risk: 'High',
        riskDetails: 'Approving puts Marcus at 45 hours this week, risking burnout.',
        priority: 'High',
        status: 'Pending',
    },
    {
        id: 'REQ-103',
        employee: 'Elena Rodriguez',
        type: 'Expense Claim',
        category: 'Expense',
        details: 'Client Dinner ($245.00)',
        submitted: '1 day ago',
        sla: 'Overdue',
        risk: 'Low',
        riskDetails: 'Within budget limit ($300).',
        priority: 'Normal',
        status: 'Pending',
    },
    {
        id: 'REQ-104',
        employee: 'Chief of Staff AI',
        type: 'Action Recommendation',
        category: 'AI',
        details: 'David Kim has missed two consecutive 1:1s.',
        submitted: 'Just now',
        sla: 'N/A',
        risk: 'Medium',
        riskDetails: 'Engagement signals indicate potential flight risk.',
        priority: 'Normal',
        status: 'Pending',
    }
];

export default function ManagerInboxPage() {
    const { toast } = useToast();
    const [tasks, setTasks] = useState(mockTasks);
    const [activeTab, setActiveTab] = useState('All');

    const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
        // Optimistic UI Update
        setTasks(prev => prev.filter(t => t.id !== id));
        toast({
            title: `Task ${action}`,
            description: `Request ${id} has been ${action.toLowerCase()}.`,
        });
    };

    const filteredTasks = activeTab === 'All' 
        ? tasks 
        : tasks.filter(t => t.category === activeTab);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manager Inbox</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        You have {tasks.length} pending actions.
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            1 Overdue
                        </Badge>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" disabled={tasks.length === 0}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve Safe Actions
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    <TabsList className="w-max sm:w-auto inline-flex">
                        <TabsTrigger value="All">All Actions ({tasks.length})</TabsTrigger>
                        <TabsTrigger value="Leave">Leave</TabsTrigger>
                        <TabsTrigger value="Attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="Expense">Expenses</TabsTrigger>
                        <TabsTrigger value="Performance">Performance</TabsTrigger>
                        <TabsTrigger value="AI">AI Insights</TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-6 space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 border rounded-xl border-dashed">
                            <Check className="h-10 w-10 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Inbox Zero</h3>
                            <p className="text-muted-foreground mt-1">You're all caught up! No pending approvals.</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <ApprovalCard key={task.id} task={task} onAction={handleAction} />
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
}

function ApprovalCard({ task, onAction }: { task: typeof mockTasks[0], onAction: (id: string, action: 'Approved'|'Rejected') => void }) {
    
    const isAI = task.category === 'AI';
    
    return (
        <Card className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${
            task.priority === 'High' ? 'border-l-orange-500' : 
            isAI ? 'border-l-purple-500' : 'border-l-slate-300'
        }`}>
            <CardContent className="p-0 sm:flex">
                
                {/* Main Content Area */}
                <div className="p-4 sm:p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            {isAI ? (
                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <ShieldAlert className="h-5 w-5 text-purple-600" />
                                </div>
                            ) : (
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-slate-100 text-slate-600">
                                        {task.employee.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    {task.employee}
                                    {isAI && <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-[10px]">AI System</Badge>}
                                </h3>
                                <p className="text-sm text-muted-foreground">{task.type}</p>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-slate-700">{task.submitted}</div>
                            <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${task.sla === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                                <Clock className="h-3 w-3" /> {task.sla}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border text-sm mb-4">
                        <span className="font-medium text-slate-800">{task.details}</span>
                    </div>

                    {/* Risk/Context Banner */}
                    <div className={`flex items-start gap-2 text-sm p-3 rounded-lg border ${
                        task.risk === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                        task.risk === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        'bg-blue-50 border-blue-100 text-blue-800'
                    }`}>
                        <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${
                            task.risk === 'High' ? 'text-orange-500' : task.risk === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                        }`} />
                        <div>
                            <span className="font-semibold">{task.risk} Risk: </span>
                            {task.riskDetails}
                        </div>
                    </div>
                </div>

                {/* Mobile SLA (Hidden on Desktop) */}
                <div className="px-4 pb-4 sm:hidden flex justify-between items-center text-xs border-b">
                    <span className="text-slate-500">{task.submitted}</span>
                    <span className={`flex items-center gap-1 ${task.sla === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                        <Clock className="h-3 w-3" /> {task.sla}
                    </span>
                </div>

                {/* Actions Area */}
                <div className="bg-slate-50/80 sm:bg-slate-50 sm:w-56 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l flex sm:flex-col gap-2 justify-end sm:justify-start">
                    {!isAI ? (
                        <>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => onAction(task.id, 'Approved')}>
                                <Check className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Approve</span>
                            </Button>
                            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onAction(task.id, 'Rejected')}>
                                <X className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Reject</span>
                            </Button>
                            <div className="hidden sm:block flex-1" />
                            <div className="hidden sm:flex flex-col gap-1 w-full">
                                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground justify-start h-8">
                                    <MessageSquare className="h-3 w-3 mr-2" /> Request changes
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground justify-start h-8">
                                    <CornerUpRight className="h-3 w-3 mr-2" /> Delegate
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => onAction(task.id, 'Approved')}>
                                <Check className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Acknowledge</span>
                            </Button>
                        </>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
