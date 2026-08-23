'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Briefcase, 
    Clock, 
    ShieldAlert, 
    TrendingUp, 
    TrendingDown,
    Activity,
    AlertTriangle,
    ArrowRight,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function HrCommandCenterHome() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Overview</h1>
                    <p className="text-muted-foreground mt-1">Company-wide workforce intelligence and operations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/hr/operations">View Operations</Link>
                    </Button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Total Headcount</p>
                                <h3 className="text-3xl font-bold text-slate-900">1,248</h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-5 w-5 text-blue-700" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="flex items-center text-green-600 font-medium"><TrendingUp className="h-4 w-4 mr-1" /> +12</span>
                            <span className="text-slate-500">this month</span>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Open Requisitions</p>
                                <h3 className="text-3xl font-bold text-slate-900">34</h3>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Briefcase className="h-5 w-5 text-purple-700" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="flex items-center text-orange-600 font-medium"><TrendingDown className="h-4 w-4 mr-1" /> -5</span>
                            <span className="text-slate-500">vs last quarter</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Turnover Rate (YTD)</p>
                                <h3 className="text-3xl font-bold text-slate-900">8.2%</h3>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Activity className="h-5 w-5 text-red-700" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="flex items-center text-red-600 font-medium"><TrendingUp className="h-4 w-4 mr-1" /> +1.2%</span>
                            <span className="text-slate-500">vs industry avg</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Pending Approvals</p>
                                <h3 className="text-3xl font-bold text-slate-900">12</h3>
                            </div>
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-700" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-amber-600 font-medium">4 overdue</span>
                            <Button variant="link" className="p-0 h-auto text-indigo-600" asChild>
                                <Link href="/hr/operations">Review <ArrowRight className="h-3 w-3 ml-1" /></Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Operations & Risk Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-red-200 shadow-sm">
                        <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                                <ShieldAlert className="h-5 w-5" /> Operational Risks
                            </CardTitle>
                            <CardDescription className="text-red-700">Immediate attention required across the organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Payroll Finalization Blocked</h4>
                                            <p className="text-sm text-slate-500 mt-1">4 departments have unapproved attendance exceptions blocking the current pay period.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/hr/operations">Resolve</Link>
                                    </Button>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex gap-3">
                                        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Expiring Visas (Next 30 Days)</h4>
                                            <p className="text-sm text-slate-500 mt-1">3 employees have work authorizations expiring within the next 30 days.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/hr/operations">View Cases</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg">Recent Organization Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Event</th>
                                        <th className="px-4 py-3 font-medium">Department</th>
                                        <th className="px-4 py-3 font-medium text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">New Hire Onboarded (J. Smith)</td>
                                        <td className="px-4 py-3 text-slate-500">Engineering</td>
                                        <td className="px-4 py-3 text-slate-500 text-right">10m ago</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">Policy Exception Approved</td>
                                        <td className="px-4 py-3 text-slate-500">Sales</td>
                                        <td className="px-4 py-3 text-slate-500 text-right">1h ago</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">Requisition Opened (Sr. Designer)</td>
                                        <td className="px-4 py-3 text-slate-500">Product</td>
                                        <td className="px-4 py-3 text-slate-500 text-right">3h ago</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Insights Side Panel */}
                <div className="space-y-6">
                    <Card className="bg-indigo-900 text-white border-indigo-800">
                        <CardHeader className="pb-3 border-b border-indigo-800">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-400" /> Workforce Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="bg-indigo-950 p-4 rounded-lg border border-indigo-800">
                                <h4 className="font-semibold text-indigo-100 flex items-center gap-2 mb-2">
                                    <TrendingDown className="h-4 w-4 text-orange-400" /> Retention Alert
                                </h4>
                                <p className="text-sm text-indigo-200">
                                    Turnover in the Customer Support department has increased by 4% this quarter. AI analysis correlates this with a 20% spike in average overtime hours.
                                </p>
                                <Button variant="link" className="text-indigo-400 px-0 mt-2 h-auto text-sm" asChild>
                                    <Link href="/hr/insights">Analyze impact &rarr;</Link>
                                </Button>
                            </div>
                            <div className="bg-indigo-950 p-4 rounded-lg border border-indigo-800">
                                <h4 className="font-semibold text-indigo-100 flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-green-400" /> Hiring Velocity
                                </h4>
                                <p className="text-sm text-indigo-200">
                                    Time-to-hire for Engineering roles has decreased to 18 days (down from 24), but candidate offer acceptance rate dropped 5%.
                                </p>
                                <Button variant="link" className="text-indigo-400 px-0 mt-2 h-auto text-sm" asChild>
                                    <Link href="/hr/insights">Simulate comp bands &rarr;</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
