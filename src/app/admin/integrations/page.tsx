'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Key, Webhook, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IntegrationsDashboard() {
  const router = useRouter();

  const metrics = [
    { label: 'API Calls (24h)', value: '14,293', icon: Activity, trend: '+12%' },
    { label: 'Active Webhooks', value: '4', icon: Webhook, trend: 'Stable' },
    { label: 'Failed Deliveries', value: '12', icon: XCircle, trend: '-5%', critical: true },
    { label: 'Active API Keys', value: '8', icon: Key, trend: 'Stable' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Manage API access, webhook subscriptions, and data mapping.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/integrations/keys')}>
            <Key className="h-4 w-4 mr-2" /> API Keys
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/integrations/webhooks')}>
            <Webhook className="h-4 w-4 mr-2" /> Webhooks
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className={m.critical ? 'border-red-200 bg-red-50/50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${m.critical ? 'text-red-800' : ''}`}>
                {m.label}
              </CardTitle>
              <m.icon className={`h-4 w-4 ${m.critical ? 'text-red-600' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${m.critical ? 'text-red-700' : ''}`}>{m.value}</div>
              <p className={`text-xs ${m.critical ? 'text-red-600' : 'text-muted-foreground'}`}>
                {m.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Webhook Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: 'employee.created', dest: 'External ERP Sync', status: 'SUCCESS', time: '2 mins ago' },
                { event: 'payroll.finalized', dest: 'NetSuite Integration', status: 'SUCCESS', time: '1 hr ago' },
                { event: 'asset.assigned', dest: 'IT Helpdesk', status: 'FAILED', time: '2 hrs ago', err: 'Timeout' }
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{log.event}</p>
                    <p className="text-xs text-muted-foreground">To: {log.dest}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {log.status === 'SUCCESS' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">{log.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 px-0">View all delivery logs →</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Ecosystem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Microsoft Entra ID (SSO)', status: 'Active', icon: LinkIcon },
                { name: 'Workday (HRIS Sync)', status: 'Active', icon: LinkIcon },
                { name: 'Greenhouse (ATS)', status: 'Not Configured', icon: LinkIcon, inactive: true }
              ].map((sys, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded bg-muted ${sys.inactive ? 'opacity-50' : ''}`}>
                      <sys.icon className="h-4 w-4" />
                    </div>
                    <span className={`font-medium ${sys.inactive ? 'text-muted-foreground' : ''}`}>
                      {sys.name}
                    </span>
                  </div>
                  <span className={`text-sm ${sys.inactive ? 'text-muted-foreground' : 'text-green-600'}`}>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">Browse Integration Marketplace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
