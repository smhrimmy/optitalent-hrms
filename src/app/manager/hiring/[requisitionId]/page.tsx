'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, 
    MapPin, 
    Banknote,
    GraduationCap,
    Clock,
    ChevronRight,
    Building2,
    ShieldAlert,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RequisitionPipelinePage() {
    const params = useParams();
    const reqId = params.requisitionId as string;

    const requisition = {
        id: reqId,
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        type: 'Full-time',
        band: 'L4 ($140k - $175k)',
        justification: 'Strategic Growth - Workforce Plan Q3 (Approved)',
        requiredSkills: ['React', 'TypeScript', 'Performance Optimization'],
        pipeline: {
            screening: [
                { id: 'c-1', name: 'Alex Rivera', source: 'Referral', timeInStage: '2 days' },
                { id: 'c-2', name: 'Jordan Lee', source: 'LinkedIn', timeInStage: '5 days' }
            ],
            interviewing: [
                { id: 'c-3', name: 'Sam Taylor', nextEvent: 'Tech Screen (Tomorrow)', match: 'Strong' }
            ],
            offer: []
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header & Requisition Context */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-slate-500 font-mono">{requisition.id}</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actively Sourcing</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{requisition.title}</h1>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {requisition.department}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {requisition.location}</div>
                        <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {requisition.type}</div>
                        <div className="flex items-center gap-1"><Banknote className="h-4 w-4" /> Pay Band: {requisition.band}</div>
                    </div>
                </div>
                
                <Card className="md:w-80 bg-slate-50 border-slate-200">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> Why are we hiring?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm text-slate-800 font-medium">
                        {requisition.justification}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="text-xs text-slate-500 uppercase font-semibold mb-2">Required Skills (Digital Twin)</h4>
                            <div className="flex flex-wrap gap-1">
                                {requisition.requiredSkills.map(s => (
                                    <Badge key={s} variant="secondary" className="bg-white">{s}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pipeline Kanban */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Candidate Pipeline</h2>
                    <Button variant="outline" className="gap-2">
                        <Users className="h-4 w-4" /> Share Pipeline View
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Screening Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-semibold text-slate-700">Recruiter Screen</h3>
                            <Badge variant="secondary">{requisition.pipeline.screening.length}</Badge>
                        </div>
                        {requisition.pipeline.screening.map(candidate => (
                            <Link href={`/manager/hiring/${reqId}/${candidate.id}`} key={candidate.id} className="block">
                                <Card className="hover:border-primary transition-colors cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">{candidate.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">{candidate.name}</h4>
                                                <p className="text-xs text-muted-foreground">{candidate.source}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>In stage: {candidate.timeInStage}</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Interviewing Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-semibold text-slate-700">Interviewing</h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">{requisition.pipeline.interviewing.length}</Badge>
                        </div>
                        {requisition.pipeline.interviewing.map(candidate => (
                            <Link href={`/manager/hiring/${reqId}/${candidate.id}`} key={candidate.id} className="block">
                                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">{candidate.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">{candidate.name}</h4>
                                                <Badge variant="outline" className="text-[10px] mt-0.5 border-green-200 text-green-700 bg-green-50">{candidate.match} Match</Badge>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 font-medium flex items-center justify-between">
                                            {candidate.nextEvent}
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Offer Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-semibold text-slate-700">Offer / Hired</h3>
                            <Badge variant="secondary">0</Badge>
                        </div>
                        <div className="p-8 border-2 border-dashed rounded-xl border-slate-200 flex flex-col items-center justify-center text-center">
                            <ShieldAlert className="h-8 w-8 text-slate-300 mb-2" />
                            <p className="text-sm font-medium text-slate-600">No active offers</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Offers must be approved via the Workflow Runtime to validate compensation bands.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
