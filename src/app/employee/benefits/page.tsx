'use client';

import React from 'react';

export default function EmployeeBenefitsDashboard() {
    const totalRewards = {
        baseCompensation: 120000,
        employerBenefitsValue: 18500,
        totalRewardsValue: 138500,
        breakdown: [
            { category: 'Health Insurance', value: 12000 },
            { category: '401(k) Match', value: 4800 },
            { category: 'Wellness Allowance', value: 1200 },
            { category: 'Internet Allowance', value: 500 }
        ]
    };

    const benefits = [
        {
            id: 'b1',
            name: 'Standard Health Plan',
            status: 'ACTIVE',
            type: 'HEALTH',
            eligible: true
        },
        {
            id: 'b2',
            name: 'Executive Health Plan',
            status: 'NOT_ENROLLED',
            type: 'HEALTH',
            eligible: false,
            ineligibilityReason: 'You do not meet the requirement for grade. Required: grade GREATER_THAN_OR_EQUALS 7. Your current profile indicates: 5.'
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Total Rewards & Benefits</h1>
                    <p className="text-muted-foreground mt-1">Manage your enrollments and view your complete compensation package.</p>
                </div>
            </div>

            {/* Total Rewards Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4">Your Total Rewards</h2>
                <div className="flex items-end gap-4 mb-6">
                    <span className="text-5xl font-extrabold text-emerald-950">${totalRewards.totalRewardsValue.toLocaleString()}</span>
                    <span className="text-emerald-700 font-medium mb-1">/ year</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/60 p-4 rounded-lg border border-emerald-100">
                        <div className="text-xs font-semibold text-emerald-700 uppercase">Base Salary</div>
                        <div className="text-xl font-bold text-gray-900">${totalRewards.baseCompensation.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg border border-emerald-100">
                        <div className="text-xs font-semibold text-emerald-700 uppercase">Benefits Value</div>
                        <div className="text-xl font-bold text-gray-900">${totalRewards.employerBenefitsValue.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Benefit Enrollments */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Your Benefit Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benefits.map(b => (
                        <div key={b.id} className={`border rounded-xl p-6 ${!b.eligible ? 'bg-gray-50 opacity-75' : 'bg-white shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{b.name}</h3>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">{b.type}</span>
                                </div>
                                {b.status === 'ACTIVE' && (
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
                                )}
                            </div>
                            
                            {!b.eligible ? (
                                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                                    <div className="text-xs font-bold text-red-800 uppercase mb-1">Why am I not eligible?</div>
                                    <div className="text-sm text-red-700">{b.ineligibilityReason}</div>
                                </div>
                            ) : (
                                <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-sm w-full transition-colors">
                                    Manage Enrollment
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
