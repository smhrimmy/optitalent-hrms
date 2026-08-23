'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, Mail, MapPin, Building2, TrendingUp, AlertCircle, FileSpreadsheet } from 'lucide-react';

const mockTeam = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        status: 'Active',
        capacity: 95,
        flightRisk: 'Low',
        direct: true,
    },
    {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Backend Developer',
        department: 'Engineering',
        location: 'Remote - TX',
        status: 'On Leave',
        capacity: 0,
        flightRisk: 'High',
        direct: true,
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'UX Designer',
        department: 'Design',
        location: 'New York, NY',
        status: 'Active',
        capacity: 80,
        flightRisk: 'Medium',
        direct: true,
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'QA Engineer',
        department: 'Engineering',
        location: 'London, UK',
        status: 'Active',
        capacity: 110, // Over-capacity
        flightRisk: 'Medium',
        direct: false, // Dotted line
        matrixManager: 'Alex Wong'
    }
];

export default function ManagerTeamPage() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Team</h1>
                    <p className="text-muted-foreground mt-1">Manage your direct reports and dotted-line matrix members.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Export Roster
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search team members by name or role..." className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-300" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <div className="border-l mx-1"></div>
                    <Button variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Direct (3)
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground">
                        Matrix (1)
                    </Button>
                </div>
            </div>

            {/* Team Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {mockTeam.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-all group overflow-hidden border-slate-200">
                        {/* Status Bar */}
                        <div className={`h-1.5 w-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Avatar className="h-14 w-14 border shadow-sm">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-lg">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {!member.direct && (
                                            <div className="absolute -bottom-2 -right-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white" title="Matrix / Dotted Line">
                                                M
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{member.name}</h3>
                                        <p className="text-sm text-slate-600 font-medium">{member.role}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                            <Building2 className="h-3 w-3" /> {member.department}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-50 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Capacity</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${member.capacity > 100 ? 'text-red-600' : 'text-slate-700'}`}>
                                            {member.capacity}%
                                        </span>
                                        {member.capacity > 100 && <AlertCircle className="h-3.5 w-3.5 text-red-500" title="Over-capacity" />}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Flight Risk</p>
                                    <Badge variant="outline" className={`
                                        ${member.flightRisk === 'High' ? 'border-red-200 bg-red-50 text-red-700' : 
                                          member.flightRisk === 'Medium' ? 'border-orange-200 bg-orange-50 text-orange-700' : 
                                          'border-green-200 bg-green-50 text-green-700'}
                                    `}>
                                        {member.flightRisk}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                <Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-slate-50 hover:text-primary">
                                    View Profile
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-slate-50 hover:text-primary">
                                    1:1 Notes
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}
