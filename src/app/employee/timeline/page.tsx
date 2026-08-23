'use client';

import React from 'react';

export default function EmployeeTimelineDashboard() {
    const events = [
        {
            id: 'e1',
            date: '22 Aug 2026',
            type: 'Promotion Approved',
            description: 'Senior Developer → Lead Developer',
            status: 'EFFECTIVE'
        },
        {
            id: 'e2',
            date: '18 Aug 2026',
            type: 'Performance Review Completed',
            description: 'Rating: Strong',
            status: 'COMPLETED'
        },
        {
            id: 'e3',
            date: '10 Aug 2026',
            type: 'Kubernetes Assessment Passed',
            description: 'Skill evidence added',
            status: 'COMPLETED'
        },
        {
            id: 'e4',
            date: '01 Aug 2026',
            type: 'Benefits Enrollment Updated',
            description: 'Executive Health Plan added',
            status: 'EFFECTIVE'
        }
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Career Timeline</h1>
                    <p className="text-muted-foreground mt-1">A chronological view of your journey at OptiTalent.</p>
                </div>
            </div>

            <div className="border rounded-xl bg-white shadow-sm p-8">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    
                    {events.map((event, idx) => (
                        <div key={event.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-900">{event.type}</span>
                                    <time className="text-xs font-semibold text-gray-500 uppercase">{event.date}</time>
                                </div>
                                <div className="text-gray-600">{event.description}</div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}
