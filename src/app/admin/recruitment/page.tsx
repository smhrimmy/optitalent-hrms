'use client';

import React from 'react';
import Link from 'next/link';

export default function RecruitmentDashboard() {
    const requisitions = [
        { id: 'req-001', title: 'Senior Backend Engineer', department: 'Engineering', location: 'Remote', status: 'OPEN', target: 2, filled: 0 },
        { id: 'req-002', title: 'Product Manager', department: 'Product', location: 'New York', status: 'DRAFT', target: 1, filled: 0 },
        { id: 'req-003', title: 'HR Generalist', department: 'People', location: 'London', status: 'FILLED', target: 1, filled: 1 }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recruitment & ATS</h1>
                    <p className="text-muted-foreground mt-1">Manage job requisitions, candidate pipelines, and internal mobility.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
                    + New Requisition
                </button>
            </div>

            <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Job Title</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Department</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Headcount</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {requisitions.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{req.title}</td>
                                <td className="px-6 py-4">{req.department}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        req.status === 'OPEN' ? 'bg-green-100 text-green-800' : 
                                        req.status === 'FILLED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right tabular-nums">
                                    {req.filled} / {req.target}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/admin/recruitment/pipeline/${req.id}`}>
                                        <button className="text-blue-600 hover:underline font-medium text-sm">View Pipeline</button>
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
