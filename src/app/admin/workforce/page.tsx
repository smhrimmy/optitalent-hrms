'use client';

import React, { useState, useEffect } from 'react';
import { getDigitalTwin } from '../../../lib/intelligence/projections';
import { whyEngine } from '../../../lib/intelligence/why-engine';
import { capacityEngine } from '../../../lib/intelligence/capacity-engine';

export default function WorkforceIntelligenceDashboard() {
  const [twin, setTwin] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);

  useEffect(() => {
    // For demo purposes, we directly query the projection in the client.
    // In production, this would be fetched via an API route enforcing permissions.
    const data = getDigitalTwin('mock-company-id');
    setTwin(data);
  }, []);

  const handleWhyClick = (metricName: string, value: number) => {
    const result = whyEngine.explainAnomaly('mock-company-id', metricName, value);
    setInsight(result);
  };

  if (!twin) return <div className="p-8">Loading Intelligence Layer...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Workforce Intelligence</h1>
      <p className="text-muted-foreground">Digital Twin last updated: {new Date(twin.lastUpdated).toLocaleString()}</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Active Headcount</h3>
          <p className="text-3xl font-bold mt-2">{twin.employees.size}</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Open Positions</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Overtime Trend</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">+18%</p>
          </div>
          <button 
            onClick={() => handleWhyClick('overtime_increase', 18)}
            className="text-xs text-blue-600 hover:underline text-left mt-2"
          >
            Why is this happening?
          </button>
        </div>
        <div className="border rounded-xl p-4 bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Data Completeness</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">82%</p>
        </div>
      </div>

      {/* "Why" Engine Explainability Panel */}
      {insight && (
        <div className="border rounded-xl p-6 bg-blue-50/50 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-blue-900">Intelligence Insight: {insight.metric}</h2>
            <button onClick={() => setInsight(null)} className="text-sm text-gray-500 hover:text-gray-800">Close</button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Associated Signals</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {insight.signals.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Evidence from Digital Twin</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {insight.evidence.map((e: string, i: number) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-blue-100">
            <span className="text-sm font-medium">Confidence: </span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              insight.confidence === 'High' ? 'bg-green-100 text-green-800' : 
              insight.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {insight.confidence}
            </span>
          </div>
          {insight.limitations.length > 0 && (
            <p className="text-xs text-muted-foreground italic">
              Note: {insight.limitations.join(' ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
