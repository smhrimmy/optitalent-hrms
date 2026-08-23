'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeGoal } from '@/lib/employee/domain';
import { GoalCard } from '@/components/employee/GoalCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AIInsightCard } from '@/components/employee/AIInsightCard';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Award, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function EmployeePerformanceOS() {
    const [goals, setGoals] = useState<EmployeeGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getGoals('emp-1');
            setGoals(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const onTrackGoals = goals.filter(g => g.status === 'ON_TRACK' || g.status === 'COMPLETED').length;
    const overallProgress = Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / (goals.length || 1));

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
                <p className="text-muted-foreground mt-1">
                    Track your goals, gather verified evidence, and prepare for your next review.
                </p>
            </div>

            {/* Performance Header */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">Performance Review: 2026 H1</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">Self-review opens in 14 days.</p>
                        </div>
                        
                        <div className="flex-1 max-w-md">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span>Overall Goal Progress</span>
                                <span>{overallProgress}%</span>
                            </div>
                            <Progress value={overallProgress} className="h-2.5 mb-2" />
                            <p className="text-sm text-muted-foreground">{onTrackGoals} / {goals.length} goals on track or completed</p>
                        </div>

                        <div>
                            <Button size="lg" asChild>
                                <Link href="/employee/performance/feedback">View Feedback</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Target className="h-5 w-5" /> Current Goals
                        </h2>
                        <Button variant="outline" size="sm">Add Goal</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {goals.length === 0 ? (
                            <div className="col-span-2 p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                You don't have any goals assigned yet.
                            </div>
                        ) : (
                            goals.map(goal => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" /> Insights
                    </h2>
                    
                    <AIInsightCard 
                        title="Goal Summary"
                        description="You are making strong progress on API Modernization."
                        reasoning="2 verified pieces of evidence added this month demonstrate consistent execution."
                    />

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Award className="h-4 w-4" /> Recent Recognition
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-3 bg-muted/50 rounded-md text-sm">
                                    <span className="font-semibold block mb-1">Sarah Chen (Manager)</span>
                                    "Excellent work driving the GraphQL migration. The team is already seeing performance benefits."
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
