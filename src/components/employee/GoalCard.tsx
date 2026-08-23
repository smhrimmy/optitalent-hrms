'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EmployeeGoal } from '@/lib/employee/domain';
import { Calendar, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface GoalCardProps {
    goal: EmployeeGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
    const statusColors = {
        'NOT_STARTED': 'bg-gray-100 text-gray-800',
        'ON_TRACK': 'bg-blue-100 text-blue-800',
        'AT_RISK': 'bg-orange-100 text-orange-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'BLOCKED': 'bg-red-100 text-red-800',
        'CANCELLED': 'bg-gray-200 text-gray-600',
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                        {goal.title}
                    </CardTitle>
                    <Badge variant="secondary" className={`${statusColors[goal.status]} border-none whitespace-nowrap`}>
                        {goal.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Progress</span>
                        <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        <span className="truncate">{goal.target}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(goal.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                        <ShieldCheck className={`h-4 w-4 ${goal.verifiedEvidenceCount > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span>{goal.verifiedEvidenceCount} Verified Evidence</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/employee/performance/goals/${goal.id}`}>Update Progress</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
