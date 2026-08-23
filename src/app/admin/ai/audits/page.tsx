'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, Shield, ArrowRight, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIAuditLogs() {
  const router = useRouter();

  const auditTrail = [
    {
      id: 'AUD-8821',
      timestamp: '2 mins ago',
      agent: 'HR Chief of Staff',
      trigger: 'User Request: "What is our attrition rate?"',
      steps: [
        { phase: 'OBSERVE', action: 'Resolved user context (Scopes: admin:all)' },
        { phase: 'REASON', action: 'Selected tool: get_metric(metricId: attrition_rate)' },
        { phase: 'ACT', action: 'Tool executed successfully', status: 'success' }
      ],
      result: 'COMPLETED'
    },
    {
      id: 'AUD-8822',
      timestamp: '15 mins ago',
      agent: 'Workforce Planner',
      trigger: 'Event: capacity.shortage.detected (Engineering)',
      steps: [
        { phase: 'OBSERVE', action: 'Fetched headcount for Engineering (124)' },
        { phase: 'REASON', action: 'Determined hiring requirement (8 FTE)' },
        { phase: 'ACT', action: 'Selected tool: simulate_scenario(hires: 8)' },
        { phase: 'ACT', action: 'Tool executed successfully', status: 'success' },
        { phase: 'REASON', action: 'Prepared recommendation for HR VP' }
      ],
      result: 'COMPLETED'
    },
    {
      id: 'AUD-8823',
      timestamp: '1 hour ago',
      agent: 'Manager Agent',
      trigger: 'User Request: "Give Priya a 15% raise"',
      steps: [
        { phase: 'OBSERVE', action: 'Resolved user context (Manager: EMP-10)' },
        { phase: 'REASON', action: 'Selected tool: modify_compensation(emp: Priya, +15%)' },
        { phase: 'ACT', action: 'Risk Tier 3 detected. Running Impact Simulation.', status: 'info' },
        { phase: 'HALT', action: 'Requires Human Approval. Routed to HR Inbox.', status: 'warning' }
      ],
      result: 'REQUIRES_APPROVAL'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Execution Audit</h1>
          <p className="text-muted-foreground mt-2">
            Transparent logs of every agent observation, reasoning step, and action.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/ai')}>
          Back to AI Dashboard
        </Button>
      </div>

      <div className="space-y-6">
        {auditTrail.map((log) => (
          <Card key={log.id} className={log.result === 'REQUIRES_APPROVAL' ? 'border-orange-200' : ''}>
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{log.agent}</CardTitle>
                    <Badge variant={log.result === 'COMPLETED' ? 'default' : 'secondary'} className={log.result === 'REQUIRES_APPROVAL' ? 'bg-orange-100 text-orange-800' : ''}>
                      {log.result}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-2 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    {log.trigger}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">{log.timestamp}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {log.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-24 text-xs font-bold text-muted-foreground pt-1 flex items-center gap-1">
                      {step.phase === 'OBSERVE' && <Eye className="h-3 w-3" />}
                      {step.phase === 'REASON' && <Cpu className="h-3 w-3" />}
                      {step.phase === 'ACT' && <ArrowRight className="h-3 w-3" />}
                      {step.phase === 'HALT' && <ShieldAlert className="h-3 w-3" />}
                      {step.phase}
                    </div>
                    <div className="flex-1 bg-muted/30 p-2 rounded text-sm font-mono flex items-center justify-between">
                      <span>{step.action}</span>
                      {step.status === 'warning' && <Shield className="h-4 w-4 text-orange-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
