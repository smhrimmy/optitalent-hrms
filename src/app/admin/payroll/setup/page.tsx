'use client';

import React, { useState } from 'react';

export default function PayrollSetupPage() {
    const [country, setCountry] = useState('IN');
    const [status, setStatus] = useState<'IDLE' | 'SAVING' | 'CONFIGURED'>('IDLE');

    const handleActivate = () => {
        setStatus('SAVING');
        setTimeout(() => setStatus('CONFIGURED'), 1000);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payroll Setup</h1>
                <p className="text-muted-foreground mt-2">
                    Configure the payroll engine and localization providers for your organization.
                </p>
            </div>

            <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Localization Provider</h2>
                    <label className="block text-sm font-medium mb-1">Country Framework</label>
                    <select 
                        className="w-full border rounded-md p-2"
                        value={country}
                        onChange={(e) => { setCountry(e.target.value); setStatus('IDLE'); }}
                    >
                        <option value="IN">India (Supported)</option>
                        <option value="US">United States (Not Configured)</option>
                        <option value="UK">United Kingdom (Not Configured)</option>
                    </select>
                    {country !== 'IN' && (
                        <p className="text-sm text-red-600 mt-2">
                            Payroll localization is not currently configured for this country. You cannot run payroll.
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <h2 className="text-xl font-semibold mb-4">Statutory Configuration</h2>
                    {country === 'IN' ? (
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                            <li>Provident Fund (PF): 12% of Basic</li>
                            <li>Professional Tax (PT): ₹200 (Gross &gt; 15,000)</li>
                            <li>TDS: Flat 10% demo rate</li>
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No statutory rules available.</p>
                    )}
                </div>

                <button 
                    onClick={handleActivate}
                    disabled={country !== 'IN' || status === 'CONFIGURED'}
                    className={`w-full py-2 rounded-md font-medium text-white ${
                        country === 'IN' 
                            ? status === 'CONFIGURED' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {status === 'CONFIGURED' ? 'Activated' : status === 'SAVING' ? 'Saving...' : 'Activate Payroll Provider'}
                </button>
            </div>
        </div>
    );
}
