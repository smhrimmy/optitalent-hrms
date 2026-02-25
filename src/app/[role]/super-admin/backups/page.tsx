'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Download, RefreshCw, Archive, Clock, HardDrive, ShieldCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function BackupsDR() {
  const { toast } = useToast();
  const [backups, setBackups] = useState([
    { id: 'bk_001', date: '2025-02-24 23:00', type: 'Full', size: '1.2 GB', status: 'Completed', location: 'S3 (us-east-1)' },
    { id: 'bk_002', date: '2025-02-23 23:00', type: 'Full', size: '1.18 GB', status: 'Completed', location: 'S3 (us-east-1)' },
    { id: 'bk_003', date: '2025-02-22 23:00', type: 'Full', size: '1.15 GB', status: 'Completed', location: 'S3 (us-east-1)' },
    { id: 'bk_004', date: '2025-02-21 23:00', type: 'Full', size: '1.12 GB', status: 'Completed', location: 'S3 (us-east-1)' },
    { id: 'bk_inc_01', date: '2025-02-25 04:00', type: 'Incremental', size: '45 MB', status: 'Completed', location: 'S3 (us-east-1)' },
  ]);

  const handleManualBackup = () => {
    toast({ title: "Backup Started", description: "A manual backup job has been queued." });
    // Simulate backup process
    setTimeout(() => {
        setBackups([{ 
            id: `bk_man_${Date.now()}`, 
            date: new Date().toISOString().slice(0, 16).replace('T', ' '), 
            type: 'Manual', 
            size: 'Calculating...', 
            status: 'In Progress', 
            location: 'Local -> S3' 
        }, ...backups]);
    }, 1000);
  };

  const handleRestore = (id: string) => {
    toast({ 
        title: "Restore Initiated", 
        description: `System restoration from backup ${id} has started. Services may be interrupted.`,
        variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" /> Backups & Disaster Recovery
          </h1>
          <p className="text-muted-foreground">Manage database snapshots, retention policies, and recovery.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleManualBackup} className="gap-2">
                <Archive className="h-4 w-4" /> Create Backup
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Next Scheduled</p>
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Today, 23:00</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Daily Full Backup</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <HardDrive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Total Storage</p>
                    <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">45.2 GB</h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Retention: 30 Days</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Encryption</p>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300">AES-256</h3>
                    <p className="text-xs text-green-600 dark:text-green-400">At Rest & In Transit</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>Recent snapshots available for restoration.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Backup ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {backups.map((bk) => (
                        <TableRow key={bk.id}>
                            <TableCell className="font-mono text-xs">{bk.id}</TableCell>
                            <TableCell>{bk.date}</TableCell>
                            <TableCell><Badge variant="outline">{bk.type}</Badge></TableCell>
                            <TableCell>{bk.size}</TableCell>
                            <TableCell>
                                <Badge className={bk.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                                    {bk.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{bk.location}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleRestore(bk.id)}>
                                        <RefreshCw className="h-4 w-4 mr-1" /> Restore
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}