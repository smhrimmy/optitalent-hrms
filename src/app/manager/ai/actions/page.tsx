'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Zap, 
    CheckCircle2, 
    ShieldAlert, 
    Clock, 
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export default function ManagerAiActions() {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <Zap className="h-8 w-8 text-amber-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Action Center</h1>
                        <p className="text-muted-foreground mt-1">AI-recommended interventions requiring your review.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="needs-approval" className="w-full mt-8">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="needs-approval" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 pt-2 px-4">
                        Needs Approval <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="recommended" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 pt-2 px-4">
                        Recommended <Badge variant="secondary" className="ml-2">5</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="simulations" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 pt-2 px-4">
                        Simulations
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 pt-2 px-4">
                        Completed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="needs-approval" className="mt-6 space-y-6">
                    
                    {/* Reallocation Recommendation Card */}
                    <Card className="border-amber-200 shadow-sm overflow-hidden">
                        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex justify-between items-center text-sm font-semibold text-amber-900">
                            <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Capacity Reallocation</span>
                            <span className="flex items-center gap-2 text-red-600"><ShieldAlert className="h-4 w-4" /> REQUIRES APPROVAL</span>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Recommendation</h4>
                                        <p className="text-slate-900 font-medium">Temporarily reallocate Alex Wong to the API Migration project.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Why now?</h4>
                                        <p className="text-sm text-slate-700">The API Migration goal is at risk (11 days remaining, 40% complete). Engineering capacity is projected at 112% next week due to planned leave.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Evidence</h4>
                                        <p className="text-sm text-slate-700">Alex's current utilization is 85% and they possess verified 'Advanced' proficiency in Node.js via the Digital Twin.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Simulated Impact</h4>
                                        <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                            <TrendingUp className="h-4 w-4" /> Project delivery probability increases to 88%
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Risk</h4>
                                        <div className="flex items-start gap-2 text-sm text-orange-700">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> 
                                            Alex's maintenance backlog will accrue an estimated 14 hours of technical debt.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                                <Button variant="outline">Dismiss</Button>
                                <Button className="bg-amber-600 hover:bg-amber-700">Approve & Route to Workflow</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Check-in Recommendation Card */}
                    <Card className="border-amber-200 shadow-sm overflow-hidden">
                        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex justify-between items-center text-sm font-semibold text-amber-900">
                            <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Flight Risk Intervention</span>
                            <span className="flex items-center gap-2 text-red-600"><ShieldAlert className="h-4 w-4" /> REQUIRES APPROVAL</span>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Recommendation</h4>
                                        <p className="text-slate-900 font-medium">Schedule an immediate 1:1 with Marcus Johnson to discuss workload.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Why now?</h4>
                                        <p className="text-sm text-slate-700">Marcus's overtime has spiked 14% over the last sprint, and his last 1:1 was missed.</p>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Proposed Action</h4>
                                        <p className="text-sm text-slate-700">Send calendar invite for tomorrow at 10:00 AM and generate draft agenda focusing on capacity support.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                                <Button variant="outline">Dismiss</Button>
                                <Button className="bg-amber-600 hover:bg-amber-700">Generate Invite & Agenda</Button>
                            </div>
                        </CardContent>
                    </Card>

                </TabsContent>

                {/* Other tabs omitted for brevity */}
            </Tabs>
        </div>
    );
}
