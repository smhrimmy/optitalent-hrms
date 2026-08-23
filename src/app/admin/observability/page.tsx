'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

export default function EnterpriseObservability() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Observability</h1>
        <p className="text-muted-foreground mt-2">
          Monitor application latency, error rates, and security events in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime (30d)</p>
                <h3 className="text-2xl font-bold mt-1">99.99%</h3>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Latency (p95)</p>
                <h3 className="text-2xl font-bold mt-1">142ms</h3>
              </div>
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <h3 className="text-2xl font-bold mt-1">0.02%</h3>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate Limit Blocks</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-600">14</h3>
              </div>
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Structured Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded font-mono text-sm">
              <div className="flex gap-4 items-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 w-20 justify-center">INFO</Badge>
                <span className="text-muted-foreground">API</span>
                <span>GET /api/employees/123 completed in 45ms</span>
              </div>
              <span className="text-muted-foreground text-xs">Just now</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded font-mono text-sm bg-orange-50/50">
              <div className="flex gap-4 items-center">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 w-20 justify-center border-orange-200">WARN</Badge>
                <span className="text-muted-foreground">SECURITY</span>
                <span>Rate limit approaching for Auth Gateway (Company-2)</span>
              </div>
              <span className="text-muted-foreground text-xs">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded font-mono text-sm bg-red-50/50">
              <div className="flex gap-4 items-center">
                <Badge variant="outline" className="bg-red-100 text-red-800 w-20 justify-center border-red-200">ERROR</Badge>
                <span className="text-muted-foreground">WORKFLOW</span>
                <span>Dead-letter queue processing failed for event: leave.approved</span>
              </div>
              <span className="text-muted-foreground text-xs">14 mins ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
