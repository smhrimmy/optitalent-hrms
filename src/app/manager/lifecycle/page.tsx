'use client';

import React from 'react';

export default function ManagerLifecycleDashboard() {
    const preview = {
        employeeName: 'Alice Smith',
        transition: 'Promotion: Grade 5 → Grade 7',
        impacts: [
            { module: 'COMPENSATION', text: 'Eligible for new salary band associated with Grade 7', type: 'POSITIVE' },
            { module: 'BENEFITS', text: 'Newly eligible for Executive Health Plan', type: 'POSITIVE' },
            { module: 'LEARNING', text: 'Leadership curriculum recommended', type: 'NEUTRAL' }
        ],
        estimatedCost: '+$416 / month'
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Initiate Lifecycle Event</h1>
                <p className="text-muted-foreground mt-1">Review the downstream impact before submitting a promotion or transfer.</p>
            </div>

            <div className="border rounded-xl bg-card shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Lifecycle Impact Preview</h2>
                    <span className="text-sm font-medium text-gray-500">{preview.employeeName}</span>
                </div>

                <div className="text-lg font-semibold text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-100">
                    Target: {preview.transition}
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Predicted Downstream Changes</h3>
                    {preview.impacts.map((imp, idx) => (
                        <div key={idx} className="flex gap-4 p-3 border rounded-lg items-center">
                            <span className="w-24 text-xs font-bold text-gray-500 uppercase">{imp.module}</span>
                            <span className={`text-sm ${imp.type === 'POSITIVE' ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                                {imp.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
                    <span className="font-semibold text-gray-700">Estimated Payroll Impact</span>
                    <span className="font-bold text-lg text-red-600">{preview.estimatedCost}</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Submit to HR</button>
                </div>
            </div>
        </div>
    );
}
