
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Cpu, HardDrive, MemoryStick, Server, Zap } from 'lucide-react';

const mockCpuData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i * 5}s`,
  usage: Math.floor(Math.random() * 40) + 20, // 20-60% base load
}));

const mockProcesses = [
    { pid: 1024, user: 'root', cpu: 12.5, mem: 4.2, command: 'node /app/server.js' },
    { pid: 1025, user: 'postgres', cpu: 8.1, mem: 15.6, command: 'postgres: main' },
    { pid: 1026, user: 'redis', cpu: 1.2, mem: 2.1, command: 'redis-server' },
    { pid: 1027, user: 'worker', cpu: 5.5, mem: 3.8, command: 'bull-mq: worker' },
    { pid: 1028, user: 'nginx', cpu: 0.8, mem: 0.5, command: 'nginx: worker process' },
];

export default function ServerHealthPage() {
  const [cpuLoad, setCpuLoad] = useState(mockCpuData);
  const [currentCpu, setCurrentCpu] = useState(35);
  const [currentMem, setCurrentMem] = useState(62);
  const [currentDisk, setCurrentDisk] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
        const newUsage = Math.floor(Math.random() * 40) + 20;
        setCurrentCpu(newUsage);
        setCpuLoad(prev => [...prev.slice(1), { time: 'now', usage: newUsage }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Server className="h-8 w-8 text-primary" /> Server Status
          </h1>
          <p className="text-muted-foreground">Real-time resource monitoring and process management (WHM Style).</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
            System Uptime: 14d 03h 22m
        </div>
      </div>

      {/* Resource Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                          <Cpu className="h-5 w-5 text-blue-500"/>
                          <span className="font-medium">CPU Usage</span>
                      </div>
                      <span className="text-2xl font-bold">{currentCpu}%</span>
                  </div>
                  <Progress value={currentCpu} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">8 Cores (AMD EPYC 7763)</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                          <MemoryStick className="h-5 w-5 text-purple-500"/>
                          <span className="font-medium">Memory Usage</span>
                      </div>
                      <span className="text-2xl font-bold">{currentMem}%</span>
                  </div>
                  <Progress value={currentMem} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">18.6 GB / 32 GB Used</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                          <HardDrive className="h-5 w-5 text-orange-500"/>
                          <span className="font-medium">Disk Usage</span>
                      </div>
                      <span className="text-2xl font-bold">{currentDisk}%</span>
                  </div>
                  <Progress value={currentDisk} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">450 GB / 1 TB NVMe SSD</p>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Load Graph */}
          <Card className="h-[400px]">
              <CardHeader>
                  <CardTitle>System Load Average (1m)</CardTitle>
                  <CardDescription>Real-time CPU load history.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cpuLoad}>
                          <defs>
                              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="time" hide />
                          <YAxis domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                      </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>

          {/* Process List */}
          <Card className="h-[400px] overflow-hidden">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/> Process Manager</CardTitle>
                  <CardDescription>Top resource-consuming processes.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground border-b pb-2">
                          <div className="col-span-2">PID</div>
                          <div className="col-span-2">USER</div>
                          <div className="col-span-2">CPU%</div>
                          <div className="col-span-2">MEM%</div>
                          <div className="col-span-4">COMMAND</div>
                      </div>
                      {mockProcesses.map((proc) => (
                          <div key={proc.pid} className="grid grid-cols-12 text-sm py-2 border-b last:border-0 hover:bg-muted/50 items-center">
                              <div className="col-span-2 font-mono text-xs">{proc.pid}</div>
                              <div className="col-span-2">{proc.user}</div>
                              <div className="col-span-2 text-blue-600 font-medium">{proc.cpu}%</div>
                              <div className="col-span-2 text-purple-600 font-medium">{proc.mem}%</div>
                              <div className="col-span-4 font-mono text-xs truncate" title={proc.command}>{proc.command}</div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Service Status */}
      <Card>
          <CardHeader>
              <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                      { name: 'httpd (Nginx)', status: 'Active', color: 'bg-green-500' },
                      { name: 'postgresql', status: 'Active', color: 'bg-green-500' },
                      { name: 'redis-server', status: 'Active', color: 'bg-green-500' },
                      { name: 'bull-mq', status: 'Processing', color: 'bg-blue-500' },
                      { name: 'cron', status: 'Active', color: 'bg-green-500' },
                      { name: 'ftpd', status: 'Inactive', color: 'bg-gray-300' },
                      { name: 'ssh', status: 'Active', color: 'bg-green-500' },
                      { name: 'fail2ban', status: 'Active', color: 'bg-green-500' },
                  ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium text-sm">{service.name}</span>
                          <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${service.color}`} />
                              <span className="text-xs text-muted-foreground">{service.status}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
