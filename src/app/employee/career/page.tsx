'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, CareerTarget } from '@/lib/employee/domain';
import { SkillGapMap } from '@/components/employee/SkillGapMap';
import { AIInsightCard } from '@/components/employee/AIInsightCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase, Target, ArrowRight } from 'lucide-react';

export default function EmployeeCareerOS() {
    const [target, setTarget] = useState<CareerTarget | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContext() {
            setLoading(true);
            const tgt = await EmployeeContextService.getCareerTarget('emp-1');
            setTarget(tgt);
            setLoading(false);
        }
        fetchContext();
    }, []);

    if (loading || !target) {
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

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Career</h1>
                <p className="text-muted-foreground mt-1">
                    Plan your growth, identify skill gaps, and explore internal opportunities.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <Card className="flex-1 bg-muted/30 border-dashed border-2">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-background rounded-full border shadow-sm">
                            <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Current Role</p>
                            <h3 className="text-xl font-bold">Senior Software Engineer</h3>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="hidden md:flex items-center justify-center px-4">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                </div>
                
                <Card className="flex-1 border-primary/20 bg-primary/5">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">Target Role</p>
                            <h3 className="text-xl font-bold">{target.title}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkillGapMap 
                    gaps={target.skillGaps} 
                    readinessScore={target.readinessScore} 
                    targetRole={target.title} 
                />

                <div className="space-y-6">
                    <h3 className="text-lg font-bold">Recommended Actions</h3>
                    {target.recommendedLearning.map(learning => (
                        <AIInsightCard 
                            key={learning.id}
                            title={learning.title}
                            description={`Recommended learning path to close skill gaps for ${target.title}.`}
                            reasoning={learning.reason}
                            actionLabel="Start Learning Path"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
