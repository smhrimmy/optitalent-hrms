
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  Activity, 
  Server, 
  ShieldCheck, 
  Database, 
  AlertTriangle 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const revenueData = [
  { month: 'Jan', amount: 12000 },
  { month: 'Feb', amount: 15000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 22000 },
  { month: 'May', amount: 25000 },
  { month: 'Jun', amount: 30000 },
];

const trafficData = [
  { time: '00:00', users: 120 },
  { time: '04:00', users: 80 },
  { time: '08:00', users: 850 },
  { time: '12:00', users: 2400 },
  { time: '16:00', users: 1900 },
  { time: '20:00', users: 450 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Super Admin Control</h1>
          <p className="text-muted-foreground">Global overview of all tenants and system health.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/maintenance">Maintenance Mode</Link>
            </Button>
            <Button asChild>
                <Link href="/super-admin/tenants">Manage Tenants</Link>
            </Button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
              <h3 className="text-2xl font-bold">142</h3>
              <p className="text-xs text-green-500 font-medium">+12 this month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">MRR</p>
              <h3 className="text-2xl font-bold">$48,250</h3>
              <p className="text-xs text-green-500 font-medium">+8.4% growth</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <h3 className="text-2xl font-bold text-green-500">99.99%</h3>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
              <h3 className="text-2xl font-bold">2,405</h3>
              <p className="text-xs text-muted-foreground">Across 12 regions</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Revenue Growth (MRR)</CardTitle>
                <CardDescription>Monthly recurring revenue over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* System Status */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Infrastructure Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm font-medium">Database (Primary)</span>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm font-medium">Database (Replica)</span>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm font-medium">API Gateway</span>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm font-medium">WAF & DDoS Protection</span>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm font-medium">Backup Service</span>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500" title="Last backup verification pending" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Real-time Traffic</CardTitle>
                    <CardDescription>Concurrent users (Last 24h)</CardDescription>
                </CardHeader>
                <CardContent className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                             <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
