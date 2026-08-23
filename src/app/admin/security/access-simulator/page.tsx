'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Shield, 
    CheckCircle2, 
    XCircle, 
    Info, 
    ArrowRight,
    Users,
    Search
} from 'lucide-react';

export default function AccessSimulator() {
    const [simulated, setSimulated] = useState(false);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-900 rounded-xl">
                    <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Effective Access Simulator</h1>
                    <p className="text-muted-foreground mt-1">Verify authorization graph intersections for delegation and matrix relationships.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Input Form */}
                <Card className="md:col-span-1 shadow-sm h-fit">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-lg">Simulation Context</CardTitle>
                        <CardDescription>Select a user and target employee to evaluate effective permissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="acting-user">Acting User (Accessor)</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input id="acting-user" placeholder="Search manager (e.g. Manager B)" className="pl-9" defaultValue="Manager B" />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <ArrowRight className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="target-emp">Target Employee</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input id="target-emp" placeholder="Search employee (e.g. Emp 1042)" className="pl-9" defaultValue="Employee 1042" />
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <Button 
                                className="w-full bg-slate-900" 
                                onClick={() => setSimulated(true)}
                            >
                                Run Access Simulation
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <div className="md:col-span-2 space-y-6">
                    {simulated ? (
                        <>
                            {/* Explanation Trace */}
                            <Card className="border-blue-200 shadow-sm">
                                <CardHeader className="bg-blue-50 border-b border-blue-100 pb-3">
                                    <CardTitle className="text-sm uppercase tracking-wider text-blue-900 flex items-center gap-2">
                                        <Info className="h-4 w-4" /> Authorization Trace
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4 text-sm text-slate-700">
                                    <div className="grid grid-cols-[120px_1fr] gap-2">
                                        <div className="font-semibold text-slate-900">Base Role:</div>
                                        <div>Standard Manager</div>
                                        
                                        <div className="font-semibold text-slate-900">Relationship:</div>
                                        <div>Matrix Manager (Project Alpha)</div>
                                        
                                        <div className="font-semibold text-slate-900">Delegation:</div>
                                        <div className="text-amber-700 font-medium">
                                            Active Delegation from <span className="underline decoration-dashed">Manager A</span> (Line Manager) 
                                            <br/>
                                            <span className="text-xs text-slate-500 font-normal">Valid: Aug 25 - Aug 30, 2026</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-100 rounded font-mono text-xs overflow-x-auto">
                                        <div className="text-slate-500">{"// Intersection Principle Applied"}</div>
                                        <div className="text-slate-700 mt-1">
                                            Effective Permission = Base Permissions ∩ Delegated Permissions ∩ Employee Scope ∩ Company Scope
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Detailed Permissions */}
                            <Card className="shadow-sm">
                                <CardHeader className="border-b pb-4">
                                    <CardTitle>Effective Permissions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                                            <tr>
                                                <th className="px-6 py-3">Permission Node</th>
                                                <th className="px-6 py-3 text-center">Access</th>
                                                <th className="px-6 py-3">Source / Why?</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium">View Profile</td>
                                                <td className="px-6 py-3 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                                                <td className="px-6 py-3 text-slate-500">Base Matrix Relationship</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium">Approve Leave</td>
                                                <td className="px-6 py-3 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                                                <td className="px-6 py-3 text-amber-600">Delegation (Manager A)</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium">View Goals</td>
                                                <td className="px-6 py-3 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                                                <td className="px-6 py-3 text-slate-500">Base Matrix Relationship</td>
                                            </tr>
                                            <tr className="bg-red-50/30 hover:bg-red-50/50">
                                                <td className="px-6 py-3 font-medium text-red-900">View Compensation</td>
                                                <td className="px-6 py-3 text-center"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                                                <td className="px-6 py-3 text-red-700">Explicitly denied in Delegation</td>
                                            </tr>
                                            <tr className="bg-red-50/30 hover:bg-red-50/50">
                                                <td className="px-6 py-3 font-medium text-red-900">Terminate Employee</td>
                                                <td className="px-6 py-3 text-center"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                                                <td className="px-6 py-3 text-red-700">Not held by Delegator (Manager A)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20 border-2 border-dashed rounded-xl">
                            <Shield className="h-12 w-12 opacity-20" />
                            <p>Run a simulation to view effective permissions.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
