'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, Activity, Bot, Store, Layers } from 'lucide-react';

export default function SystemHealthCenter() {
  const components = [
    { name: 'Authentication', icon: <ShieldIcon className="h-5 w-5" />, status: 'HEALTHY', latency: '45ms' },
    { name: 'Database', icon: <Database className="h-5 w-5" />, status: 'HEALTHY', latency: '12ms' },
    { name: 'Event Bus', icon: <Zap className="h-5 w-5" />, status: 'HEALTHY', latency: '5ms' },
    { name: 'Workflow Runtime', icon: <Activity className="h-5 w-5" />, status: 'HEALTHY', latency: '89ms' },
    { name: 'Payroll Engine', icon: <Layers className="h-5 w-5" />, status: 'HEALTHY', latency: '210ms' },
    { name: 'AI Orchestrator', icon: <Bot className="h-5 w-5" />, status: 'DEGRADED', latency: '1250ms', error: 'High token latency' },
    { name: 'Marketplace Gateway', icon: <Store className="h-5 w-5" />, status: 'HEALTHY', latency: '60ms' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground mt-2">
          Dependency map and live status of the Workforce OS infrastructure.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {components.map((comp, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${comp.status === 'HEALTHY' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {comp.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{comp.name}</h3>
                    {comp.error && <p className="text-sm text-orange-600 mt-1">{comp.error}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={comp.status === 'HEALTHY' ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'}>
                    {comp.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">Latency: {comp.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary icon to avoid huge import lists
function ShieldIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
