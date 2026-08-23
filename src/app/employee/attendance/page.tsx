'use client';

import React from 'react';

export default function EmployeeAttendance() {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const explainTrace = [
        { rule: 'Clock In', evaluation: 'IN punch found at 09:17', passed: true },
        { rule: 'Scheduled Shift', evaluation: 'Scheduled for FIXED Shift (09:00 - 18:00)', passed: true },
        { rule: 'Grace Period', evaluation: 'Grace period allows 15 minutes delay', passed: true },
        { rule: 'Late Arrival Check', evaluation: 'Actual arrival (557m) exceeded scheduled start (540m) by 17 minutes', passed: false },
        { rule: 'Overtime Check', evaluation: 'Stayed 42 minutes past scheduled end. Requires manager approval.', passed: false }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Time & Attendance</h1>
                    <p className="text-muted-foreground mt-1">Manage your punches and view daily insights.</p>
                </div>
                <div className="space-x-3">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold">Clock Out</button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">Clock In</button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 border rounded-xl bg-card shadow-sm p-6 text-center space-y-2">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Schedule</h2>
                    <div className="text-2xl font-bold text-gray-800">09:00 - 18:00</div>
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 py-1 px-2 rounded-full inline-block">Fixed Shift</div>
                </div>
                <div className="col-span-1 border rounded-xl bg-card shadow-sm p-6 text-center space-y-2">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Time Worked</h2>
                    <div className="text-2xl font-bold text-gray-800">9h 25m</div>
                    <div className="text-xs font-medium text-green-600 bg-green-50 py-1 px-2 rounded-full inline-block">On Track</div>
                </div>
                <div className="col-span-1 border rounded-xl bg-card shadow-sm p-6 text-center space-y-2">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</h2>
                    <div className="text-2xl font-bold text-orange-600">Exceptions</div>
                    <div className="text-xs font-medium text-orange-600 bg-orange-50 py-1 px-2 rounded-full inline-block">Review Required</div>
                </div>
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden mt-8">
                <div className="bg-gray-50 p-4 border-b">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span>Explain Attendance:</span>
                        <span className="text-gray-600">{today}</span>
                    </h2>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Result</div>
                            <div className="font-semibold text-gray-800">Present</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Late</div>
                            <div className="font-semibold text-red-600">17 minutes</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Early Departure</div>
                            <div className="font-semibold text-gray-800">None</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Overtime</div>
                            <div className="font-semibold text-blue-600">42 minutes</div>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-4">Calculation Trace</h3>
                    <div className="space-y-3 font-mono text-sm">
                        {explainTrace.map((step, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-lg border bg-gray-50 items-start">
                                <div className="mt-0.5">
                                    {step.passed ? <span className="text-green-500 font-bold">✓</span> : <span className="text-red-500 font-bold">✗</span>}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700">{step.rule}</div>
                                    <div className="text-gray-500">{step.evaluation}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
