'use client';

import React from 'react';
import Link from 'next/link';

export default function PipelineKanban({ params }: { params: { reqId: string } }) {
    // Demo Kanban State
    const columns = [
        {
            id: 'SCREENING', title: 'Screening',
            candidates: [
                { id: 'c-101', name: 'Rahul Verma', score: 'STRONG', role: 'SDE II' },
                { id: 'c-102', name: 'Anita Patel', score: 'WEAK', role: 'DevOps' }
            ]
        },
        {
            id: 'INTERVIEWING', title: 'Interviewing',
            candidates: [
                { id: 'c-201', name: 'John Doe', score: 'MODERATE', role: 'Frontend' }
            ]
        },
        {
            id: 'OFFER', title: 'Offer Extended',
            candidates: []
        },
        {
            id: 'HIRED', title: 'Hired',
            candidates: [
                { id: 'c-301', name: 'Priya Sharma', score: 'STRONG', role: 'Backend Lead' }
            ]
        }
    ];

    return (
        <div className="p-8 h-screen flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pipeline: Senior Backend Engineer</h1>
                    <p className="text-muted-foreground mt-1">Req ID: {params.reqId} • 0 / 2 Filled</p>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium text-sm">
                    Internal Mobility Check
                </button>
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className="w-80 flex-shrink-0 bg-gray-50 rounded-xl border flex flex-col">
                        <div className="p-4 border-b bg-gray-100/50 rounded-t-xl font-semibold flex justify-between">
                            <span>{col.title}</span>
                            <span className="text-muted-foreground bg-gray-200 px-2 rounded-full text-xs flex items-center">
                                {col.candidates.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 space-y-3 overflow-y-auto">
                            {col.candidates.map(candidate => (
                                <Link key={candidate.id} href={`/admin/recruitment/candidate/${candidate.id}`}>
                                    <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow transition-shadow cursor-pointer">
                                        <div className="font-medium text-sm">{candidate.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{candidate.role}</div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className={`text-[10px] px-2 py-1 rounded-sm font-bold tracking-wide ${
                                                candidate.score === 'STRONG' ? 'bg-green-100 text-green-700' :
                                                candidate.score === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {candidate.score} MATCH
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {col.candidates.length === 0 && (
                                <div className="text-center text-sm text-gray-400 py-8 border-2 border-dashed rounded-lg">
                                    Drop candidates here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
