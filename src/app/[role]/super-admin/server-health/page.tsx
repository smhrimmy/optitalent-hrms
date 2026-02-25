'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function ServerHealth() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 28,
    uptime: '14d 2h 15m',
    status: 'Healthy',
    lastUpdated: new Date()
  });

  const refreshMetrics = () => {
    // Simulate fetching new data
    setMetrics({
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 20) + 50,
      disk: 28, // Static for now
      uptime: '14d 2h 16m',
      status: 'Healthy',
      lastUpdated: new Date()
    });
  };

  useEffect(() => {
    const interval = setInterval(refreshMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Server className="h-8 w-8 text-primary" /> Server Health Monitor
          </h1>
          <p className="text-muted-foreground">Real-time infrastructure performance metrics.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={refreshMetrics} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-500" />
                        <span className="text-2xl font-bold">{metrics.cpu}%</span>
                    </div>
                    <Badge variant={metrics.cpu > 80 ? "destructive" : "outline"}>
                        {metrics.cpu > 80 ? 'High Load' : 'Normal'}
                    </Badge>
                </div>
                <Progress value={metrics.cpu} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">4 Cores Active</p>
            </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <span className="text-2xl font-bold">{metrics.memory}%</span>
                    </div>
                    <Badge variant={metrics.memory > 90 ? "destructive" : "outline"}>
                        {metrics.memory > 90 ? 'Critical' : 'Stable'}
                    </Badge>
                </div>
                <Progress value={metrics.memory} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">4GB / 8GB Used</p>
            </CardContent>
        </Card>

        {/* Disk Usage */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Disk Storage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-orange-500" />
                        <span className="text-2xl font-bold">{metrics.disk}%</span>
                    </div>
                    <Badge variant="outline">Healthy</Badge>
                </div>
                <Progress value={metrics.disk} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">140GB Free of 200GB</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/> System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium">All Systems Operational</p>
                            <p className="text-xs text-muted-foreground">Last check: {metrics.lastUpdated.toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <Badge className="bg-green-500">Online</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                        <p className="text-xl font-bold font-mono">{metrics.uptime}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                        <p className="text-xl font-bold font-mono">45ms</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">High Memory Usage Warning</p>
                            <p className="text-xs text-muted-foreground">Memory usage spiked to 85% at 04:00 AM. Automated garbage collection triggered.</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Today, 04:05 AM</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                        <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">Scheduled Backup Completed</p>
                            <p className="text-xs text-muted-foreground">Daily database backup completed successfully. Size: 1.2GB.</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Yesterday, 11:00 PM</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}