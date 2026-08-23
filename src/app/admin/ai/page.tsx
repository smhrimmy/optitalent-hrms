'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, ShieldCheck, Activity, Search, ShieldAlert, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIObservabilityDashboard() {
  const router = useRouter();

  const agents = [
    { name: 'HR Chief of Staff', purpose: 'Executive Analysis', tools: ['get_metric', 'simulate_scenario'], status: 'active' },
    { name: 'Onboarding Agent', purpose: 'Coordinate new hires', tools: ['create_request', 'get_metric'], status: 'active' },
    { name: 'Workforce Planner', purpose: 'Demand/capacity scenarios', tools: ['simulate_scenario'], status: 'active' },
    { name: 'Compliance Agent', purpose: 'Monitor policy', tools: ['get_metric', 'create_request'], status: 'active' },
  ];

  const tools = [
    { name: 'get_metric', tier: 0, approvals: 'None' },
    { name: 'create_request', tier: 1, approvals: 'None' },
    { name: 'modify_compensation', tier: 3, approvals: 'Required' },
    { name: 'terminate_employee', tier: 4, approvals: 'Strict' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Observability</h1>
          <p className="text-muted-foreground mt-2">
            Monitor, audit, and govern autonomous agents.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Global Kill Switch
          </Button>
          <Button onClick={() => router.push('/admin/ai/audits')} className="gap-2">
            <Search className="h-4 w-4" />
            View Audit Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">across 4 departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tool Invocations (24h)</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,492</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Human Approvals</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">7</div>
            <p className="text-xs text-orange-600">Tier 3+ actions awaiting sign-off</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Agent Registry</CardTitle>
            <CardDescription>Configured autonomous workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent, i) => (
                <div key={i} className="flex justify-between items-start border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {agent.name}
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">{agent.purpose}</p>
                    <div className="flex gap-2 mt-2">
                      {agent.tools.map(t => (
                        <span key={t} className="text-xs bg-muted px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tool Authorization</CardTitle>
            <CardDescription>Risk classification and approval requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tools.map((tool, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      Approval: {tool.approvals}
                    </p>
                  </div>
                  <Badge variant={tool.tier >= 3 ? 'destructive' : 'secondary'}>
                    Tier {tool.tier}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
