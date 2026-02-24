
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Archive, CheckCircle2, Clock, Cloud, Download, HardDrive, RefreshCcw, ShieldCheck, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Backup = {
  id: string;
  timestamp: string;
  size: string;
  type: 'Automated' | 'Manual';
  status: 'Completed' | 'Failed' | 'In Progress';
  location: 'Google Drive (US-East)';
  verified: boolean;
};

const initialBackups: Backup[] = [
  { id: 'bk_104', timestamp: '2025-02-24 12:00:00', size: '4.2 GB', type: 'Automated', status: 'Completed', location: 'Google Drive (US-East)', verified: true },
  { id: 'bk_103', timestamp: '2025-02-24 06:00:00', size: '4.1 GB', type: 'Automated', status: 'Completed', location: 'Google Drive (US-East)', verified: true },
  { id: 'bk_102', timestamp: '2025-02-24 00:00:00', size: '4.1 GB', type: 'Automated', status: 'Completed', location: 'Google Drive (US-East)', verified: true },
  { id: 'bk_101', timestamp: '2025-02-23 18:00:00', size: '4.0 GB', type: 'Automated', status: 'Completed', location: 'Google Drive (US-East)', verified: true },
];

export default function BackupRecoveryPage() {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setProgress(0);
    
    // Simulate backup process
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsBackingUp(false);
                const newBackup: Backup = {
                    id: `bk_${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    size: '4.2 GB',
                    type: 'Manual',
                    status: 'Completed',
                    location: 'Google Drive (US-East)',
                    verified: true
                };
                setBackups([newBackup, ...backups]);
                toast({ title: "Backup Successful", description: "Snapshot uploaded to Google Drive securely." });
                return 100;
            }
            return prev + 10;
        });
    }, 300);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Disaster Recovery</h1>
          <p className="text-muted-foreground">Manage automated backups and system snapshots.</p>
        </div>
        <Button onClick={handleManualBackup} disabled={isBackingUp}>
            {isBackingUp ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin"/> : <Cloud className="mr-2 h-4 w-4"/>}
            {isBackingUp ? 'Backing Up...' : 'Trigger Manual Backup'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Current retention policy and schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-500"/>
                            <span className="font-semibold">Frequency</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Every 6 Hours</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Archive className="h-4 w-4 text-green-500"/>
                            <span className="font-semibold">Retention</span>
                        </div>
                        <p className="text-sm text-muted-foreground">30 Days (Encrypted)</p>
                    </div>
                     <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                            <HardDrive className="h-4 w-4 text-purple-500"/>
                            <span className="font-semibold">Storage</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Google Drive (Business)</p>
                    </div>
                     <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500"/>
                            <span className="font-semibold">Verification</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Automatic Checksum</p>
                    </div>
                </div>
                
                {isBackingUp && (
                    <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-xs">
                            <span>Uploading snapshot to cloud...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recovery Status</CardTitle>
                <CardDescription>RPO and RTO metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">RPO (Data Loss Risk)</span>
                        <span className="text-sm font-bold text-green-500">5 min</span>
                    </div>
                    <Progress value={5} max={60} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: &lt; 15 min</p>
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">RTO (Recovery Time)</span>
                        <span className="text-sm font-bold text-green-500">12 min</span>
                    </div>
                    <Progress value={12} max={60} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: &lt; 30 min</p>
                </div>
                
                <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                        <AlertTriangle className="mr-2 h-4 w-4"/> Initiate Disaster Recovery
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">Requires Super Admin 2FA</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Snapshots</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="space-y-4">
                {backups.map((bk) => (
                    <div key={bk.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium">{bk.id}</p>
                                <p className="text-xs text-muted-foreground">{bk.timestamp} • {bk.size}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="hidden md:inline-flex">{bk.type}</Badge>
                            <div className="flex items-center gap-2">
                                {bk.verified && <CheckCircle2 className="h-4 w-4 text-green-500" title="Verified Integrity"/>}
                                <span className="text-sm font-medium">{bk.status}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                ))}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
