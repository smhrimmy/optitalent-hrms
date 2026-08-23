'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, PowerOff, Power } from 'lucide-react';
import { GlobalAIKillSwitch } from '@/lib/ai/governance/killswitch';
import { AIGovernanceRegistry } from '@/lib/ai/governance/registry';

export default function AIGovernanceUI() {
  const [killSwitchState, setKillSwitchState] = useState(GlobalAIKillSwitch.getStatus());
  const [incidents, setIncidents] = useState(AIGovernanceRegistry.getRecentIncidents(5));

  const toggleGlobalAI = () => {
    if (killSwitchState.globalEnabled) {
      GlobalAIKillSwitch.engageGlobalKillSwitch('admin-123');
    } else {
      GlobalAIKillSwitch.disengageGlobalKillSwitch('admin-123');
    }
    setKillSwitchState(GlobalAIKillSwitch.getStatus());
    // Refresh incidents to show the kill switch log
    setIncidents(AIGovernanceRegistry.getRecentIncidents(5));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Governance</h1>
          <p className="text-muted-foreground mt-2">
            Control the execution boundaries of Autonomous Agents across the platform.
          </p>
        </div>
      </div>

      <Card className={`border-2 ${killSwitchState.globalEnabled ? 'border-primary/20' : 'border-red-500 bg-red-50/50'}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${killSwitchState.globalEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Global AI Kill Switch</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {killSwitchState.globalEnabled 
                    ? 'AI Agents are permitted to execute tools based on their RBAC configurations.' 
                    : 'ALL AI EXECUTION IS CURRENTLY HALTED. Workflows requiring AI will fail.'}
                </p>
              </div>
            </div>
            <Button 
              variant={killSwitchState.globalEnabled ? 'destructive' : 'default'}
              size="lg"
              className="gap-2"
              onClick={toggleGlobalAI}
            >
              {killSwitchState.globalEnabled ? (
                <><PowerOff className="h-5 w-5" /> Engage Kill Switch</>
              ) : (
                <><Power className="h-5 w-5" /> Disengage Kill Switch</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Incidents & Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent incidents.</p>
            ) : (
              <div className="space-y-4">
                {incidents.map(inc => (
                  <div key={inc.id} className="border-b pb-4 last:border-0 flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{inc.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Agent: {inc.agentId} • {inc.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <Badge variant="outline" className={
                      inc.level === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                      inc.level === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }>
                      {inc.level}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suspended Components</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">
               Targeted kill switches for specific agents or tools.
             </p>
             <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium text-sm">Agent: Recruitment-Bot-v2</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded border-red-200 bg-red-50">
                  <span className="font-medium text-sm">Tool: modify_payroll_record</span>
                  <Badge variant="outline" className="text-red-600 bg-red-100 border-red-200">Suspended</Badge>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
