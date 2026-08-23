'use client';

import React from 'react';

export default function EmployeeGoals() {
    const goals = [
        {
            id: 'g-1',
            title: 'Ship Phase 3 of HRMS',
            status: 'ACTIVE',
            progress: 65,
            linkedSkills: ['System Architecture', 'React'],
            keyResults: [
                { title: 'Complete Payroll Engine', current: 100, target: 100, unit: '%', status: 'COMPLETED' },
                { title: 'Complete ATS Module', current: 100, target: 100, unit: '%', status: 'COMPLETED' },
                { title: 'Complete Performance Module', current: 10, target: 100, unit: '%', status: 'ON_TRACK' }
            ]
        }
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My OKRs & Goals</h1>
                    <p className="text-muted-foreground mt-1">Track your objectives and their impact on your Digital Twin.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
                    + New Goal
                </button>
            </div>

            <div className="space-y-4">
                {goals.map(goal => (
                    <div key={goal.id} className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-start bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold">{goal.title}</h2>
                                <div className="flex gap-2 mt-2">
                                    {goal.linkedSkills.map(s => (
                                        <span key={s} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{goal.progress}%</div>
                                <div className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-1">{goal.status}</div>
                            </div>
                        </div>
                        <div className="p-5 space-y-4 bg-white">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Results</h3>
                            {goal.keyResults.map((kr, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{kr.title}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div 
                                                className={`h-2 rounded-full ${kr.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${(kr.current / kr.target) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="ml-6 w-32 flex justify-end gap-3 items-center">
                                        <span className="text-sm font-semibold tabular-nums">{kr.current} / {kr.target} {kr.unit}</span>
                                        <button className="text-gray-400 hover:text-gray-700">✎</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
