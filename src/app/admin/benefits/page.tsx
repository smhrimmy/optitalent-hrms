'use client';

import React from 'react';

export default function AdminBenefitsDashboard() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Benefits Administration</h1>
                <p className="text-muted-foreground mt-1">Manage global benefit plans, eligibility rules, and enrollments.</p>
            </div>

            <div className="border rounded-xl bg-card shadow-sm p-8 text-center text-gray-500">
                <p>Eligibility Policy Builder will be available in the next iteration.</p>
            </div>
        </div>
    );
}
