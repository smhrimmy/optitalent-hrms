'use client';

import React, { useState } from 'react';
import { workforceSimulator, SimulationResult } from '../../../../lib/intelligence/simulator';

export default function SimulatorPage() {
    const [count, setCount] = useState<number>(10);
    const [department, setDepartment] = useState('engineering');
    const [result, setResult] = useState<SimulationResult | null>(null);

    const handleSimulate = () => {
        // In a real application, this would call the API.
        const res = workforceSimulator.simulateHiringEvent('mock-company-id', count, department, 'manager-1');
        setResult(res);
    };

    return (
        <div className="p-8 space-y-6 max-w-4xl">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Workforce Simulator</h1>
                <p className="text-muted-foreground mt-2">
                    Test hypothetical workforce scenarios safely without modifying production data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Scenario Builder */}
                <div className="space-y-4 border rounded-xl p-6 bg-card">
                    <h2 className="text-xl font-semibold">Scenario: Mass Hiring</h2>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Number of Hires</label>
                        <input 
                            type="number" 
                            className="w-full border rounded p-2" 
                            value={count} 
                            onChange={(e) => setCount(Number(e.target.value))} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target Department</label>
                        <select 
                            className="w-full border rounded p-2"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="engineering">Engineering</option>
                            <option value="sales">Sales</option>
                            <option value="manufacturing">Manufacturing</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleSimulate}
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium"
                    >
                        Run Simulation
                    </button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        This is a read-only projection. Production data will not be affected.
                    </p>
                </div>

                {/* Results Panel */}
                {result ? (
                    <div className="space-y-4 border rounded-xl p-6 bg-blue-50/30 border-blue-100">
                        <h2 className="text-xl font-semibold text-blue-900">Simulation Results</h2>
                        <p className="text-sm font-medium">{result.scenarioName}</p>

                        <div className="space-y-4 mt-6">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-gray-600">Total Headcount</span>
                                <div className="flex space-x-4">
                                    <span className="text-sm line-through text-gray-400">{result.metrics.originalHeadcount}</span>
                                    <span className="text-sm font-bold">{result.metrics.simulatedHeadcount}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm font-medium text-gray-600">Managers w/ High Span Risk (&gt;12)</span>
                                <div className="flex space-x-4">
                                    <span className="text-sm line-through text-gray-400">{result.metrics.originalManagerSpanHighRiskCount}</span>
                                    <span className={`text-sm font-bold ${result.metrics.simulatedManagerSpanHighRiskCount > result.metrics.originalManagerSpanHighRiskCount ? 'text-red-600' : ''}`}>
                                        {result.metrics.simulatedManagerSpanHighRiskCount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {result.metrics.simulatedManagerSpanHighRiskCount > result.metrics.originalManagerSpanHighRiskCount && (
                            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded text-sm border border-red-100">
                                <strong>Warning:</strong> This scenario creates a management bottleneck. Consider promoting or hiring a new manager.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border rounded-xl p-6 bg-muted/20 flex items-center justify-center text-muted-foreground text-sm">
                        Run a scenario to see projected impacts.
                    </div>
                )}
            </div>
        </div>
    );
}
