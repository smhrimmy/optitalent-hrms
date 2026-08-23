'use client';

import React, { useState } from 'react';
import { payrollService } from '../../../../lib/payroll/service';
import { EmployeeCompensation, PayrollInput, PayrollRun } from '../../../../lib/payroll/types';

export default function PayrollRunDetail({ params }: { params: { runId: string } }) {
    const [run, setRun] = useState<PayrollRun | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [trace, setTrace] = useState<string[] | null>(null);

    const handleCalculate = async () => {
        setCalculating(true);
        try {
            // Mock Data for Demo
            const mockComp: EmployeeCompensation[] = [
                {
                    employeeId: 'EMP-001',
                    effectiveFrom: '2026-01-01',
                    currency: 'INR',
                    annualCTC: 1200000,
                    monthlyBasic: 50000,
                    components: [
                        { id: 'c1', code: 'BASIC', name: 'Basic Pay', type: 'EARNING', isTaxable: true, calculationMethod: 'FIXED', value: 50000 },
                        { id: 'c2', code: 'HRA', name: 'House Rent Allowance', type: 'EARNING', isTaxable: true, calculationMethod: 'PERCENTAGE_OF_BASIC', value: 40 }
                    ]
                }
            ];
            const mockInputs: PayrollInput[] = [
                { employeeId: 'EMP-001', type: 'OVERTIME_HOURS', value: 8, source: 'Attendance' }
            ];
            
            const context = { companyId: 'company-1', userId: 'admin', roles: ['PayrollAdmin'] };
            // In real app, this calls an API route
            const result = await payrollService.calculateRun(context, params.runId, mockComp, mockInputs, 'IN');
            setRun(result);
        } catch (e: any) {
            alert('Error calculating payroll: ' + e.message);
        } finally {
            setCalculating(false);
        }
    };

    const handleFinalize = async () => {
        if (!run) return;
        try {
            const context = { companyId: 'company-1', userId: 'admin', roles: ['PayrollAdmin'] };
            const result = await payrollService.finalizeRun(context, run.id);
            setRun(result);
        } catch (e: any) {
            alert('Error finalizing: ' + e.message);
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payroll Run: {run?.periodName || 'August 2026'}</h1>
                    <p className="text-muted-foreground mt-1">Status: <span className="font-semibold">{run?.status || 'DRAFT'}</span></p>
                </div>
                <div className="space-x-3">
                    <button 
                        onClick={handleCalculate}
                        disabled={calculating || run?.status === 'FINALIZED'}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium"
                    >
                        {calculating ? 'Calculating...' : 'Calculate Payroll'}
                    </button>
                    {run?.status === 'CALCULATED' && (
                        <button 
                            onClick={handleFinalize}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                        >
                            Finalize
                        </button>
                    )}
                </div>
            </div>

            {run && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Gross</h3>
                        <p className="text-2xl font-bold mt-2">₹{run.totalGross.toLocaleString()}</p>
                    </div>
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Deductions</h3>
                        <p className="text-2xl font-bold mt-2">₹{run.totalDeductions.toLocaleString()}</p>
                    </div>
                    <div className="border rounded-xl p-4 bg-green-50 shadow-sm border-green-100">
                        <h3 className="text-sm font-medium text-green-800">Total Net Pay</h3>
                        <p className="text-2xl font-bold mt-2 text-green-900">₹{run.totalNet.toLocaleString()}</p>
                    </div>
                </div>
            )}

            {run && run.employeeResults.length > 0 && (
                <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Employee ID</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Gross</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Deductions</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Tax</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Net Pay</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-center">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {run.employeeResults.map(emp => (
                                <tr key={emp.employeeId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{emp.employeeId}</td>
                                    <td className="px-6 py-4 text-right tabular-nums">₹{emp.gross.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right tabular-nums text-red-600">₹{emp.deductions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right tabular-nums text-red-600">₹{emp.tax.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right tabular-nums font-bold text-green-700">₹{emp.net.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => setTrace(emp.calculationTrace)}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Explain Calculation
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Explanation Modal */}
            {trace && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Calculation Trace</h2>
                            <button onClick={() => setTrace(null)} className="text-gray-500 hover:text-gray-800">✕</button>
                        </div>
                        <div className="overflow-y-auto flex-1 font-mono text-sm bg-gray-50 p-4 rounded border">
                            {trace.map((line, i) => (
                                <div key={i} className="mb-2 pb-2 border-b border-gray-200 last:border-0">{line}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
