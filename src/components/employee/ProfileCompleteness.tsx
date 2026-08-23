'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProfileCompletenessProps {
    score: number;
    missingFields: string[];
}

export function ProfileCompleteness({ score, missingFields }: ProfileCompletenessProps) {
    if (score >= 100) return null;

    return (
        <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-900">Profile Completeness</h3>
                    </div>
                    <span className="font-bold text-orange-700">{score}%</span>
                </div>
                
                <Progress value={score} className="h-2 mb-4 [&>div]:bg-orange-500" />
                
                <div className="space-y-2">
                    <p className="text-sm text-orange-800 font-medium">Missing information:</p>
                    <ul className="list-disc pl-5 text-sm text-orange-800/80 space-y-1">
                        {missingFields.map((field, idx) => (
                            <li key={idx}>{field}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-4">
                    <Button variant="outline" className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-100" asChild>
                        <Link href="/employee/profile?edit=true">Complete Profile</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
