'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PayrollDashboard() {
    const [runs, setRuns] = useState([
        { id: 'run-aug-2026', period: 'August 2026', status: 'DRAFT', employees: 0, netPay: 0 },
        { id: 'run-jul-2026', period: 'July 2026', status: 'FINALIZED', employees: 124, netPay: 8540000 }
    ]);

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payroll Administration</h1>
                    <p className="text-muted-foreground mt-1">Manage, calculate, and finalize organization payroll.</p>
                </div>
                <Link href="/admin/payroll/setup">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium text-sm">
                        ⚙️ Setup & Localization
                    </button>
                </Link>
            </div>

            <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Period</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Employees</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Total Net Pay</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {runs.map(run => (
                            <tr key={run.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{run.period}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        run.status === 'FINALIZED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {run.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right tabular-nums">{run.employees}</td>
                                <td className="px-6 py-4 text-right tabular-nums">
                                    {run.netPay > 0 ? `₹${run.netPay.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/admin/payroll/${run.id}`}>
                                        <button className="text-blue-600 hover:underline font-medium">View Run</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
