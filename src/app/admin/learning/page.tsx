'use client';

import React from 'react';

export default function AdminLearningDashboard() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Learning & Capability Administration</h1>
                <p className="text-muted-foreground mt-1">Manage courses, view skill coverage, and track mandatory compliance.</p>
            </div>

            <div className="border rounded-xl bg-card shadow-sm p-8 text-center text-gray-500">
                <p>Course Builder and Compliance metrics will be available in the next iteration.</p>
            </div>
        </div>
    );
}
