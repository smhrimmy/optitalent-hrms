'use client';

import React from 'react';

export default function CourseCatalog() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
                <p className="text-muted-foreground mt-1">Browse available training mapped to organizational skills.</p>
            </div>

            <div className="border rounded-xl bg-card shadow-sm p-8 text-center text-gray-500">
                <p>Course catalog search and filtering will be available in the next iteration.</p>
            </div>
        </div>
    );
}
