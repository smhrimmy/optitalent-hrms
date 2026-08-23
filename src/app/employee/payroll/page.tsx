'use client';

import React from 'react';

export default function EmployeePayrollDashboard() {
    // Demo data for the employee view
    const payslips = [
        { id: 'ps-aug', period: 'August 2026', date: '2026-08-31', netPay: 43200 },
        { id: 'ps-jul', period: 'July 2026', date: '2026-07-31', netPay: 43200 },
        { id: 'ps-jun', period: 'June 2026', date: '2026-06-30', netPay: 39500 }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Payroll & Compensation</h1>
                <p className="text-muted-foreground mt-2">View your payslips, tax documents, and salary structure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-6 bg-card shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Current Compensation</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Annual CTC</span>
                            <span className="font-semibold">₹6,00,000</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Monthly Basic</span>
                            <span className="font-semibold">₹25,000</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Effective Since</span>
                            <span className="font-semibold">01 Jan 2026</span>
                        </div>
                    </div>
                </div>

                <div className="border rounded-xl p-6 bg-card shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Tax Documents (India)</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <span>Form 16 (FY 2025-26)</span>
                            <button className="text-blue-600 hover:underline">Download PDF</button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <span>Investment Declaration</span>
                            <button className="text-blue-600 hover:underline">Edit</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Payslip History</h2>
                <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Period</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Payment Date</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Net Pay</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {payslips.map(ps => (
                                <tr key={ps.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{ps.period}</td>
                                    <td className="px-6 py-4">{ps.date}</td>
                                    <td className="px-6 py-4 text-right tabular-nums text-green-700 font-semibold">
                                        ₹{ps.netPay.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-blue-600 hover:underline font-medium text-xs">
                                            Download Payslip
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
