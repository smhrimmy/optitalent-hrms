'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Network, 
    Shield, 
    ArrowRight,
    Users,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function MatrixRelationships() {
    const relationships = [
        {
            employee: 'Elena Rodriguez',
            role: 'UX Designer',
            relationships: [
                { type: 'Line Manager', manager: 'You', status: 'Primary', access: 'Full Scope' },
                { type: 'Project Manager', manager: 'David Kim', status: 'Matrix', access: 'Project Alpha Only' },
                { type: 'Mentor', manager: 'Sarah Chen', status: 'Advisory', access: 'View Profile Only' }
            ]
        },
        {
            employee: 'Alex Wong',
            role: 'Backend Engineer',
            relationships: [
                { type: 'Line Manager', manager: 'Ravi Patel', status: 'Primary', access: 'Full Scope' },
                { type: 'Project Manager', manager: 'You', status: 'Matrix', access: 'API Migration Only' }
            ]
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Matrix Relationships</h1>
                    <p className="text-muted-foreground mt-1">Manage cross-functional reporting lines and access scope.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/manager/delegation">View Delegations</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                
                {/* Info Panel */}
                <Card className="bg-slate-900 text-white h-fit">
                    <CardHeader className="pb-3 border-b border-slate-700">
                        <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2">
                            <Network className="h-4 w-4 text-slate-400" /> Matrix Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-sm text-slate-300">
                        <p>Matrix relationships define organizational structure, but <strong>do not automatically grant blanket permissions</strong>.</p>
                        <ul className="list-disc list-inside space-y-2 ml-1 text-slate-400">
                            <li>Line Managers hold primary access.</li>
                            <li>Project Managers hold scope restricted strictly to their project context (e.g. they cannot view base compensation).</li>
                        </ul>
                        <div className="pt-4 mt-4 border-t border-slate-700">
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href="/admin/security/access-simulator">Run Access Simulator</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Relationships List */}
                <div className="md:col-span-2 space-y-4">
                    {relationships.map((rel, i) => (
                        <Card key={i} className="shadow-sm">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-white text-slate-600 font-bold border">{rel.employee.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{rel.employee}</CardTitle>
                                        <CardDescription>{rel.role}</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Edit Map</Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white text-slate-500 font-semibold border-b text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3">Relationship Type</th>
                                            <th className="px-6 py-3">Manager</th>
                                            <th className="px-6 py-3 text-right">Access Scope</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {rel.relationships.map((r, j) => (
                                            <tr key={j} className="hover:bg-slate-50">
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {r.status === 'Primary' ? (
                                                            <Users className="h-4 w-4 text-blue-500" />
                                                        ) : (
                                                            <Briefcase className="h-4 w-4 text-slate-400" />
                                                        )}
                                                        <span className="font-medium text-slate-900">{r.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-700 font-medium">
                                                    {r.manager === 'You' ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">You</Badge> : r.manager}
                                                </td>
                                                <td className="px-6 py-3 text-right text-slate-500 text-xs">
                                                    {r.access}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>

        </div>
    );
}
