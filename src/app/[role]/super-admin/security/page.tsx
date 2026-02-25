'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Lock, Globe, Ban, ShieldCheck, Activity, Search, AlertOctagon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function SecurityCenter() {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState('');
  const [blockedIps, setBlockedIps] = useState([
    { ip: '192.168.1.105', reason: 'Failed Login Attempts (50+)', date: '2025-02-24 10:30' },
    { ip: '10.0.0.45', reason: 'SQL Injection Pattern', date: '2025-02-23 14:15' },
    { ip: '172.16.0.22', reason: 'DDoS Traffic Spike', date: '2025-02-22 09:00' },
  ]);

  const [wafRules, setWafRules] = useState([
    { id: 1, name: 'SQL Injection Protection', enabled: true, level: 'High' },
    { id: 2, name: 'Cross-Site Scripting (XSS)', enabled: true, level: 'High' },
    { id: 3, name: 'Remote File Inclusion', enabled: true, level: 'Medium' },
    { id: 4, name: 'Bot Traffic Filter', enabled: true, level: 'Low' },
    { id: 5, name: 'Rate Limiting (API)', enabled: true, level: 'High' },
  ]);

  const handleBlockIp = () => {
    if (!ipAddress) return;
    setBlockedIps([{ ip: ipAddress, reason: 'Manual Block via Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...blockedIps]);
    setIpAddress('');
    toast({ title: "IP Address Blocked", description: `${ipAddress} has been added to the firewall blacklist.` });
  };

  const handleUnblock = (ip: string) => {
    setBlockedIps(blockedIps.filter(item => item.ip !== ip));
    toast({ title: "IP Unblocked", description: `${ip} access has been restored.` });
  };

  const toggleWaf = (id: number) => {
    setWafRules(wafRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: "WAF Rule Updated", description: "Security policy changes applied instantly." });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" /> Security Center
          </h1>
          <p className="text-muted-foreground">Manage firewall rules, WAF policies, and threat detection.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="destructive" className="gap-2">
                <AlertOctagon className="h-4 w-4" /> System Lockdown
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Cards */}
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Firewall Status</p>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">Active</h3>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">WAF Rules</p>
                    <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300">{wafRules.filter(r => r.enabled).length} / {wafRules.length}</h3>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Blocked Threats</p>
                    <h3 className="text-2xl font-bold text-red-800 dark:text-red-300">1,240</h3>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IP Blocker */}
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ban className="h-5 w-5"/> IP Blocker</CardTitle>
                <CardDescription>Manually deny access to specific IP addresses or ranges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter IP Address (e.g. 192.168.1.1)" 
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                    />
                    <Button onClick={handleBlockIp}>Block</Button>
                </div>
                
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blockedIps.map((item) => (
                                <TableRow key={item.ip}>
                                    <TableCell className="font-mono">{item.ip}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{item.reason}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleUnblock(item.ip)}>
                                            Unblock
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        {/* WAF Configuration */}
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/> WAF Configuration</CardTitle>
                <CardDescription>Configure Web Application Firewall rulesets.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {wafRules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">{rule.name}</p>
                                <Badge variant="outline" className="mt-1 text-xs">{rule.level} Priority</Badge>
                            </div>
                            <Switch 
                                checked={rule.enabled}
                                onCheckedChange={() => toggleWaf(rule.id)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* SSL Manager */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5"/> SSL/TLS Certificate Manager</CardTitle>
              <CardDescription>Manage certificates for all tenant domains.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead>Issuer</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Auto-Renew</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      <TableRow>
                          <TableCell className="font-medium">*.optitalent.com</TableCell>
                          <TableCell>Let's Encrypt R3</TableCell>
                          <TableCell>2026-05-15 (80 days left)</TableCell>
                          <TableCell><Badge className="bg-green-500">Valid</Badge></TableCell>
                          <TableCell className="text-right"><Switch checked disabled /></TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell className="font-medium">api.optitalent.com</TableCell>
                          <TableCell>DigiCert Global G2</TableCell>
                          <TableCell>2027-01-01 (300 days left)</TableCell>
                          <TableCell><Badge className="bg-green-500">Valid</Badge></TableCell>
                          <TableCell className="text-right"><Switch checked /></TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}