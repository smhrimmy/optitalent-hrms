'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Search, 
    Filter, 
    GraduationCap, 
    AlertCircle, 
    CheckCircle2, 
    ChevronRight,
    TrendingUp,
    Briefcase,
    ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerSkillsMatrix() {
    const roles = [
        {
            title: 'Backend Engineering',
            coverage: 74,
            skills: [
                { name: 'Node.js', coverage: 92, status: 'Healthy' },
                { name: 'PostgreSQL', coverage: 86, status: 'Healthy' },
                { name: 'API Design', coverage: 78, status: 'Watch' },
                { name: 'Cloud Architecture', coverage: 41, status: 'Critical' }
            ]
        }
    ];

    const teamSkills = [
        { emp: 'Sarah Chen', role: 'Sr Frontend', skill: 'React', proficiency: 'Expert (5/5)', target: '5/5', gap: 0, evidence: 'Verified via Digital Twin (PR #402)' },
        { emp: 'Marcus Johnson', role: 'Backend', skill: 'Cloud Architecture', proficiency: 'Novice (1/5)', target: '4/5', gap: -3, evidence: 'Self-reported' },
        { emp: 'Elena Rodriguez', role: 'UX', skill: 'Figma', proficiency: 'Advanced (4/5)', target: '4/5', gap: 0, evidence: 'Verified via Design System contribs' },
        { emp: 'Marcus Johnson', role: 'Backend', skill: 'Node.js', proficiency: 'Advanced (4/5)', target: '4/5', gap: 0, evidence: 'Verified via Digital Twin' }
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skills OS</h1>
                    <p className="text-muted-foreground mt-1">Track competencies, gaps, and evidence via the Digital Twin.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/manager/capacity">View Capacity Dashboard</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Panel: Coverage Rollups */}
                <div className="lg:col-span-1 space-y-6">
                    {roles.map((role, i) => (
                        <Card key={i} className="bg-slate-50 border-slate-200">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-base">{role.title} Coverage</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${role.coverage > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${role.coverage}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{role.coverage}%</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y text-sm">
                                    {role.skills.map((s, j) => (
                                        <div key={j} className="p-3 flex justify-between items-center hover:bg-slate-100 transition-colors">
                                            <span className="font-medium text-slate-700">{s.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={s.status === 'Critical' ? 'text-red-600 font-bold' : s.status === 'Watch' ? 'text-orange-600 font-bold' : 'text-slate-500'}>
                                                    {s.coverage}%
                                                </span>
                                                {s.status === 'Critical' && <ShieldAlert className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t bg-white">
                                    <h4 className="text-xs font-bold uppercase text-red-700 mb-2 flex items-center gap-1">
                                        <ShieldAlert className="h-3.5 w-3.5" /> Critical Gap: Cloud Arch
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" variant="outline" className="w-full text-left justify-start">
                                            <GraduationCap className="h-4 w-4 mr-2" /> Train (Learning OS)
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full text-left justify-start">
                                            <Briefcase className="h-4 w-4 mr-2" /> Hire (Open Requisition)
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Right Panel: Detailed Matrix */}
                <Card className="lg:col-span-3">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between bg-white">
                        <CardTitle>Team Skills Matrix</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filter Gaps</Button>
                            <Button variant="outline" size="sm" className="gap-2"><Search className="h-4 w-4" /> Search Skill</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Skill</th>
                                    <th className="px-6 py-4">Proficiency</th>
                                    <th className="px-6 py-4 text-center">Gap</th>
                                    <th className="px-6 py-4">Evidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {teamSkills.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">{row.emp.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{row.emp}</div>
                                                    <div className="text-xs text-slate-500">{row.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{row.skill}</td>
                                        <td className="px-6 py-4">
                                            {row.proficiency}
                                            <div className="text-xs text-muted-foreground mt-0.5">Target: {row.target}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.gap < 0 ? (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">{row.gap}</Badge>
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {row.evidence.includes('Verified') ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                                ) : (
                                                    <AlertCircle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                                                )}
                                                <span className={`text-xs ${row.evidence.includes('Verified') ? 'text-slate-700' : 'text-slate-500 italic'}`}>
                                                    {row.evidence}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
