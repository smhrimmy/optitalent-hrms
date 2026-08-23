'use client';

import React, { useState } from 'react';

export default function TeamPerformanceDashboard() {
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>('emp-1');

    // Demo Data
    const team = [
        { id: 'emp-1', name: 'Rahul Verma', role: 'SDE II', status: 'REVIEW_READY' },
        { id: 'emp-2', name: 'Anita Patel', role: 'SDE I', status: 'DRAFT' }
    ];

    const aiSummary = {
        recommendation: 'Exceeds Expectations. Strong delivery on OKRs and demonstrable skill expansion.',
        achievements: ['Completed Goal: Ship Phase 3 of HRMS (100% Progress)'],
        growth: [
            { skill: 'System Architecture', source: 'GOAL_COMPLETION', date: '2026-08-20' }
        ],
        feedback: ['Peer feedback highlights strong collaboration, but notes a need for better documentation on complex features.']
    };

    return (
        <div className="p-8 h-screen flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Performance: Q3 2026</h1>
                    <p className="text-muted-foreground mt-1">Conduct reviews using AI-synthesized evidence from the Digital Twin.</p>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border rounded-xl bg-card shadow-sm overflow-y-auto">
                    <div className="p-4 border-b font-semibold bg-gray-50 text-gray-700">Direct Reports</div>
                    <div className="divide-y">
                        {team.map(emp => (
                            <div 
                                key={emp.id} 
                                onClick={() => setSelectedEmployee(emp.id)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedEmployee === emp.id ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="font-semibold">{emp.name}</div>
                                <div className="text-sm text-gray-500 mt-1">{emp.role}</div>
                                <div className="mt-2 flex">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                        emp.status === 'REVIEW_READY' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {emp.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-2/3 border rounded-xl bg-card shadow-sm flex flex-col overflow-hidden">
                    {selectedEmployee === 'emp-1' ? (
                        <>
                            <div className="p-6 border-b bg-white">
                                <h2 className="text-2xl font-bold">Review: Rahul Verma</h2>
                                <div className="flex gap-4 mt-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
                                        Finalize Review & Trigger Merit Workflow
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-6">
                                {/* AI Summary Card */}
                                <div className="border border-purple-200 rounded-xl bg-purple-50/50 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-purple-100 bg-purple-100/50 flex items-center gap-2">
                                        <span className="text-purple-700 font-bold">✨ AI Chief of Staff Summary</span>
                                    </div>
                                    <div className="p-5 space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-2">Recommendation</h3>
                                            <p className="text-gray-800 font-medium">{aiSummary.recommendation}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Achievements</h3>
                                                <ul className="space-y-2 text-sm text-gray-700">
                                                    {aiSummary.achievements.map((a, i) => <li key={i} className="flex gap-2"><span>✓</span><span>{a}</span></li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Skill Growth (Verified)</h3>
                                                <ul className="space-y-2 text-sm text-gray-700">
                                                    {aiSummary.growth.map((g, i) => (
                                                        <li key={i} className="flex flex-col border-l-2 border-purple-300 pl-3">
                                                            <span className="font-semibold text-purple-900">{g.skill}</span>
                                                            <span className="text-xs text-gray-500">Source: {g.source} ({g.date})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Synthesized Peer Feedback</h3>
                                            <p className="text-sm text-gray-700 italic border-l-4 border-gray-200 pl-4 py-1">
                                                "{aiSummary.feedback[0]}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Manager Form */}
                                <div className="border rounded-xl bg-white shadow-sm p-6 space-y-4">
                                    <h3 className="text-lg font-bold">Manager Comments</h3>
                                    <textarea 
                                        className="w-full h-32 border rounded-md p-3 text-sm"
                                        placeholder="Add your review notes here..."
                                        defaultValue="Rahul has had an exceptional quarter, successfully shipping the new engines while expanding his architectural skills."
                                    />
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Final Rating</label>
                                        <select className="border rounded-md p-2 w-64 text-sm" defaultValue="EXCEEDS">
                                            <option value="EXCEEDS">Exceeds Expectations</option>
                                            <option value="MEETS">Meets Expectations</option>
                                            <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select an employee to begin review
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
