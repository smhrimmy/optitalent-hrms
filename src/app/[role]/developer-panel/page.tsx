
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, Plus, RefreshCw, Trash2, Webhook, Code, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DeveloperPanelPage() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Production API Key', prefix: 'pk_live_', created: '2025-01-15', lastUsed: '2 hours ago', status: 'Active' },
    { id: 'key_2', name: 'Staging API Key', prefix: 'pk_test_', created: '2025-02-10', lastUsed: 'Just now', status: 'Active' },
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 'wh_1', url: 'https://api.company.com/webhooks/hrms', events: ['employee.created', 'leave.approved'], status: 'Active' },
    { id: 'wh_2', url: 'https://slack-bot.company.com/events', events: ['attendance.checkin'], status: 'Failed' },
  ]);

  const generateKey = () => {
    const newKey = {
        id: `key_${Date.now()}`,
        name: `New Key ${apiKeys.length + 1}`,
        prefix: 'pk_test_',
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'Active'
    };
    setApiKeys([...apiKeys, newKey]);
    toast({ title: "API Key Generated", description: "Store it safely. You won't be able to see it again." });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Developer Panel</h1>
        <p className="text-muted-foreground">Manage API keys, webhooks, and integrations.</p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>API Access Keys</CardTitle>
                    <CardDescription>Manage keys for accessing the HRMS API.</CardDescription>
                </div>
                <Button onClick={generateKey}><Plus className="w-4 h-4 mr-2"/> Generate New Key</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {key.prefix}****************
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => copyToClipboard(key.prefix + 'xyz...')}>
                            <Copy className="h-3 w-3"/>
                        </Button>
                      </TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{key.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>Sandbox Environment</CardTitle>
                  <CardDescription>Test your API calls here.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                      <p className="text-green-400">curl --request GET \</p>
                      <p className="pl-4">--url 'https://api.hrms.com/v1/employees' \</p>
                      <p className="pl-4">--header 'Authorization: Bearer pk_live_...' \</p>
                      <p className="pl-4">--header 'Content-Type: application/json'</p>
                  </div>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Webhook Endpoints</CardTitle>
                        <CardDescription>Listen for events on your own server.</CardDescription>
                    </div>
                    <Button><Plus className="w-4 h-4 mr-2"/> Add Endpoint</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Endpoint URL</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {webhooks.map((wh) => (
                                <TableRow key={wh.id}>
                                    <TableCell className="font-mono text-xs">{wh.url}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {wh.events.map(e => <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={wh.status === 'Active' ? 'default' : 'destructive'}>{wh.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>API Logs</CardTitle>
                    <CardDescription>Recent API requests and responses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground text-center py-8">No logs available for the last 24 hours.</div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
