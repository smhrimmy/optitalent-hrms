'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
    Target, 
    MessageSquare, 
    CheckCircle2, 
    ArrowUpRight, 
    Star, 
    Calendar,
    Briefcase,
    GraduationCap,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EmployeePerformanceProfile() {
    const params = useParams();
    const employeeId = params.employeeId as string;

    // Simulated data fetching (In reality, PermissionService verifies access here)
    const employee = {
        name: employeeId === 'emp-1' ? 'Sarah Chen' : employeeId === 'emp-2' ? 'Marcus Johnson' : 'Elena Rodriguez',
        role: 'Senior Frontend Engineer',
        department: 'Engineering',
        goals: [
            { id: 1, title: 'Lead API Migration Project', status: 'On Track', progress: 85, evidence: 4 },
            { id: 2, title: 'Mentor 2 Junior Engineers', status: 'Completed', progress: 100, evidence: 6 },
            { id: 3, title: 'Reduce Bundle Size by 15%', status: 'At Risk', progress: 40, evidence: 1 },
        ],
        recentFeedback: [
            { id: 1, from: 'Alex Wong (Product)', text: 'Sarah was instrumental in unblocking the release. Her technical breakdown of the API issue saved us days of work.', type: 'Peer Recognition', date: '2 days ago' },
            { id: 2, from: 'David Kim (QA)', text: 'The recent feature push had zero regressions. Excellent test coverage.', type: 'Verified Evidence', date: '1 week ago' }
        ]
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            
            {/* Header / Profile Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 shadow-sm">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl font-bold">
                            {employee.name.split(' ').map(n=>n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{employee.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Briefcase className="h-4 w-4" />
                            {employee.role} • {employee.department}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">Give Feedback</Button>
                    <Button className="flex-1 md:flex-none gap-2 bg-slate-900 hover:bg-slate-800" asChild>
                        <Link href="/manager/one-on-ones">
                            <MessageSquare className="h-4 w-4" /> Start 1:1
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="goals" className="w-full">
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    <TabsList className="w-max sm:w-auto inline-flex">
                        <TabsTrigger value="goals">Goals & Evidence</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback Stream</TabsTrigger>
                        <TabsTrigger value="1on1">1:1 History</TabsTrigger>
                        <TabsTrigger value="development">Skill & Career Growth</TabsTrigger>
                        <TabsTrigger value="reviews">Past Reviews</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="goals" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Active Goals</h3>
                        <Button variant="link" className="text-primary px-0">Set New Goal</Button>
                    </div>

                    <div className="grid gap-4">
                        {employee.goals.map(goal => (
                            <Card key={goal.id} className="overflow-hidden border-l-4 border-l-primary">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="w-full sm:w-2/3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                                                <Badge variant="outline" className={
                                                    goal.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                                    goal.status === 'At Risk' ? 'bg-orange-50 text-orange-700' :
                                                    'bg-blue-50 text-blue-700'
                                                }>{goal.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                        <span>Progress</span>
                                                        <span>{goal.progress}%</span>
                                                    </div>
                                                    <Progress value={goal.progress} className={`h-1.5 ${goal.status === 'At Risk' ? '[&>div]:bg-orange-500' : '[&>div]:bg-primary'}`} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-3 sm:w-1/3 border w-full text-sm">
                                            <div className="flex items-center gap-2 font-medium text-slate-800 mb-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                Verified Evidence ({goal.evidence})
                                            </div>
                                            {goal.evidence > 0 ? (
                                                <p className="text-xs text-slate-600">
                                                    Latest: Commits merged to `core-api` referencing this objective.
                                                </p>
                                            ) : (
                                                <p className="text-xs text-orange-600 italic flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> No evidence verified yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="feedback" className="mt-6 space-y-4">
                    {employee.recentFeedback.map(fb => (
                        <div key={fb.id} className="p-4 border rounded-xl bg-white shadow-sm flex gap-4">
                            <Avatar className="h-10 w-10 mt-1">
                                <AvatarFallback className="bg-slate-100 text-slate-600">
                                    {fb.from.split(' ')[0][0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <p className="font-medium text-slate-900">{fb.from}</p>
                                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${
                                            fb.type === 'Verified Evidence' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {fb.type}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {fb.date}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 mt-2">"{fb.text}"</p>
                            </div>
                        </div>
                    ))}
                </TabsContent>

                {/* Other Tabs content omitted for brevity, focusing on the core Performance OS features */}
            </Tabs>
        </div>
    );
}
