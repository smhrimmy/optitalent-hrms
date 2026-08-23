'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
    FileText, 
    Bot, 
    GraduationCap, 
    Briefcase,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Calendar,
    ChevronLeft,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CandidateWorkspacePage() {
    const params = useParams();
    const reqId = params.requisitionId as string;
    const candidateId = params.candidateId as string;

    const [score, setScore] = useState<{ [key: string]: string | null }>({
        tech: null,
        comms: null,
        culture: null
    });

    const candidate = {
        name: 'Sam Taylor',
        role: 'Senior Frontend Engineer',
        appliedDate: 'Oct 12, 2026',
        stage: 'Interviewing',
        verifiedSkills: ['React (5 yrs)', 'TypeScript (4 yrs)', 'Redux (3 yrs)'],
        experience: [
            { role: 'Frontend Engineer', company: 'TechFlow Inc.', years: '2023 - Present' },
            { role: 'Web Developer', company: 'Digital Solutions', years: '2020 - 2023' }
        ]
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <Button variant="link" className="px-0 text-slate-500 mb-2 h-auto" asChild>
                        <Link href={`/manager/hiring/${reqId}`}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border shadow-sm">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-xl font-bold">
                                {candidate.name.split(' ').map(n=>n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{candidate.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                Applied {candidate.appliedDate} • Stage: <Badge variant="secondary">{candidate.stage}</Badge>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800">
                        Move to Offer Stage
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile & Resume</TabsTrigger>
                    <TabsTrigger value="interview">Interview Scorecard</TabsTrigger>
                    <TabsTrigger value="ai">AI Match Analysis</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="border-b bg-slate-50">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-slate-500" /> Experience</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {candidate.experience.map((exp, i) => (
                                    <div key={i} className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{exp.role}</h4>
                                            <p className="text-sm text-slate-600">{exp.company}</p>
                                        </div>
                                        <span className="text-sm text-slate-500">{exp.years}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="border-b bg-slate-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-slate-500" /> Verified Skills
                                </CardTitle>
                                <CardDescription>Extracted directly from resume parsing. No AI inference.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap gap-2">
                                    {candidate.verifiedSkills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1 bg-slate-100">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" /> sam_taylor_resume.pdf
                                    <Download className="h-4 w-4 ml-auto text-slate-400" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Scorecard Tab */}
                <TabsContent value="interview" className="mt-6">
                    <Card className="max-w-3xl border-slate-300 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle>Structured Interview Scorecard</CardTitle>
                            <CardDescription>Rate the candidate solely on job-relevant competencies. Changes auto-save.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            
                            {/* Competency Row */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-slate-900">Technical Competence (React/TS)</h4>
                                    <div className="flex gap-2">
                                        {['Strong No', 'No', 'Yes', 'Strong Yes'].map(opt => (
                                            <Button 
                                                key={opt} 
                                                variant={score.tech === opt ? (opt.includes('Yes') ? 'default' : 'destructive') : 'outline'}
                                                size="sm"
                                                onClick={() => setScore({...score, tech: opt})}
                                                className={score.tech === opt ? '' : 'text-slate-500'}
                                            >
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea placeholder="Evidence from technical screen..." className="resize-none" />
                            </div>

                            {/* Competency Row */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-slate-900">Communication & Collaboration</h4>
                                    <div className="flex gap-2">
                                        {['Strong No', 'No', 'Yes', 'Strong Yes'].map(opt => (
                                            <Button 
                                                key={opt} 
                                                variant={score.comms === opt ? (opt.includes('Yes') ? 'default' : 'destructive') : 'outline'}
                                                size="sm"
                                                onClick={() => setScore({...score, comms: opt})}
                                                className={score.comms === opt ? '' : 'text-slate-500'}
                                            >
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea placeholder="Evidence from behavioral questions..." className="resize-none" />
                            </div>

                            <div className="border-t pt-6 flex justify-end">
                                <Button className="bg-slate-900">Submit Final Scorecard</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AI Analysis Tab */}
                <TabsContent value="ai" className="mt-6">
                    <Card className="max-w-3xl border-purple-200 bg-purple-50/30">
                        <CardHeader className="border-b border-purple-100">
                            <CardTitle className="text-purple-900 flex items-center gap-2">
                                <Bot className="h-5 w-5 text-purple-600" /> AI Hiring Assistant
                            </CardTitle>
                            <CardDescription className="text-purple-700/80">
                                This analysis is based strictly on anonymized, verified skills against the required Digital Twin competencies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="bg-white p-4 rounded-lg border border-purple-100">
                                <h4 className="font-semibold text-slate-900 mb-2">Role Alignment</h4>
                                <p className="text-sm text-slate-700">
                                    Candidate meets <strong>3 of 3</strong> required skills (React, TypeScript, Performance Optimization). 
                                    However, they lack experience in the "Nice-to-have" skill of GraphQL.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-purple-100">
                                <h4 className="font-semibold text-slate-900 mb-2">Recommended Interview Focus</h4>
                                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                                    <li>Probe on experience dealing with large-scale bundle optimization.</li>
                                    <li>Ask about their approach to adopting new API layers, given the lack of GraphQL exposure.</li>
                                </ul>
                            </div>
                            <div className="text-xs text-slate-400 italic text-center mt-4">
                                Note: PII, educational institutions, and geographic locations were scrubbed before generating this analysis to prevent proxy bias.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
