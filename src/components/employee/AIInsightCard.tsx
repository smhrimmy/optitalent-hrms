'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsightCardProps {
    title: string;
    description: string;
    reasoning: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function AIInsightCard({ title, description, reasoning, actionLabel, onAction }: AIInsightCardProps) {
    return (
        <Card className="border-indigo-200 bg-indigo-50/30">
            <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4">
                    <div className="mt-1">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-indigo-950">{title}</h4>
                        <p className="text-sm text-indigo-900/80">{description}</p>
                        
                        <div className="mt-4 p-3 bg-white/60 rounded-md border border-indigo-100 text-sm text-indigo-900/90 font-mono">
                            <span className="font-bold block mb-1">Why?</span>
                            {reasoning}
                        </div>

                        {actionLabel && (
                            <div className="mt-4 pt-2">
                                <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100" onClick={onAction}>
                                    {actionLabel} <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
