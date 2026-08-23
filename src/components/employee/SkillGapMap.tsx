'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SkillGap {
    skillName: string;
    currentLevel: number;
    requiredLevel: number;
}

interface SkillGapMapProps {
    gaps: SkillGap[];
    readinessScore: number;
    targetRole: string;
}

export function SkillGapMap({ gaps, readinessScore, targetRole }: SkillGapMapProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Role Readiness: {targetRole}</span>
                    <span className="text-2xl font-bold text-primary">{readinessScore}%</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-muted-foreground">Overall Verified Skills</span>
                    </div>
                    <Progress value={readinessScore} className="h-2" />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold">Key Skill Gaps</h4>
                    {gaps.map((gap, idx) => {
                        const percentOfRequired = Math.min(100, Math.round((gap.currentLevel / gap.requiredLevel) * 100));
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{gap.skillName}</span>
                                    <span className="text-muted-foreground">{gap.currentLevel} / {gap.requiredLevel}</span>
                                </div>
                                <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                                    {/* Required Marker */}
                                    <div 
                                        className="absolute top-0 bottom-0 w-0.5 bg-primary/50 z-10" 
                                        style={{ left: `${gap.requiredLevel}%` }} 
                                    />
                                    {/* Current Progress */}
                                    <div 
                                        className={`absolute top-0 bottom-0 left-0 transition-all ${percentOfRequired >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${gap.currentLevel}%` }} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
