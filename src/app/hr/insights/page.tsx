'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    BrainCircuit,
    ArrowRight,
    Users,
    Activity,
    SlidersHorizontal,
    Search
} from 'lucide-react';
import Link from 'next/link';

export default function HrInsights() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Decisions & Insights</h1>
                    <p className="text-muted-foreground mt-1">AI-powered analytics and workforce simulations.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <Button variant="ghost" size="sm" className="bg-white shadow-sm">Retention</Button>
                    <Button variant="ghost" size="sm" className="text-slate-500">Recruitment</Button>
                    <Button variant="ghost" size="sm" className="text-slate-500">Compensation</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Analytics Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">Turnover Risk Analysis</CardTitle>
                                    <CardDescription>Q3 2026 Predictive Model vs Actuals</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                    <BrainCircuit className="h-3 w-3 mr-1" /> AI Generated
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-4">
                                {/* Placeholder for actual charting library like Recharts */}
                                <div className="text-center text-slate-400">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Interactive Trend Chart Visualization</p>
                                    <p className="text-xs mt-1">Showing 12-month historical data + 3-month predictive forecast.</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                    <h4 className="font-semibold text-red-900 flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4" /> Primary Risk Driver
                                    </h4>
                                    <p className="text-sm text-red-700 leading-relaxed">
                                        <strong>Compensation Compression:</strong> Engineers hired before 2024 are currently paid 12% below the new hire bands. This cohort represents 60% of current flight risks.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <h4 className="font-semibold text-emerald-900 flex items-center gap-2 mb-2">
                                        <Activity className="h-4 w-4" /> Recommended Action
                                    </h4>
                                    <p className="text-sm text-emerald-700 leading-relaxed">
                                        <strong>Targeted Market Adjustment:</strong> Allocate $120k from the Q4 reserve to adjust base bands for the 18 affected engineers. 
                                    </p>
                                    <Button variant="link" className="text-emerald-700 px-0 mt-2 h-auto text-sm" asChild>
                                        <Link href="/hr/insights/simulate">Simulate adjustment impact &rarr;</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Workforce Simulation Sandbox</CardTitle>
                            <CardDescription>Test structural changes before execution.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <SlidersHorizontal className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Compensation Band Restructuring</h4>
                                            <p className="text-sm text-slate-500 mt-1">Simulate impact of increasing Engineering Level 2 bands by 5%.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">Hiring Freeze Impact</h4>
                                            <p className="text-sm text-slate-500 mt-1">Forecast capacity deficits if Q4 non-critical hiring is suspended.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Ask HR Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Why did turnover rise in Sales?" 
                                    className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-medium text-slate-500 uppercase">Suggested Queries</p>
                                <button className="w-full text-left text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded transition-colors">
                                    Compare Q2 vs Q3 hiring velocity
                                </button>
                                <button className="w-full text-left text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded transition-colors">
                                    Show managers with highest team overtime
                                </button>
                                <button className="w-full text-left text-sm text-slate-700 hover:text-indigo-600 hover:bg-slate-50 p-2 rounded transition-colors">
                                    Analyze pay equity across departments
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-indigo-400" /> Data Governance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-300 space-y-4">
                            <p>
                                This workspace operates under strict HR-ABAC rules. Aggregate data is shown organization-wide, but drilling down to individual records requires explicit field-level permissions.
                            </p>
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <p className="font-medium text-white mb-1">Audit Logging Active</p>
                                <p className="text-xs">All simulation exports and compensation queries are logged to the compliance registry.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
