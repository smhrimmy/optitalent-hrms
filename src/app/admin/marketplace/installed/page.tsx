'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, ShieldAlert, Activity, CheckCircle2, MoreVertical } from 'lucide-react';
import { ExtensionLifecycleManager } from '@/lib/marketplace/lifecycle';
import { ExtensionRegistry } from '@/lib/marketplace/registry';
import { useRouter } from 'next/navigation';

export default function AdminInstalledExtensions() {
  const router = useRouter();
  
  // MOCK: Fetching for TENANT-1
  const installed = ExtensionLifecycleManager.getInstalledExtensions('TENANT-1');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Installed Extensions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your active Marketplace Apps, AI Agents, and Industry Packs.
          </p>
        </div>
        <Button onClick={() => router.push('/marketplace')} className="gap-2">
          <Store className="h-4 w-4" />
          Browse Marketplace
        </Button>
      </div>

      <div className="space-y-4">
        {installed.map((inst, idx) => {
          const ext = ExtensionRegistry.getExtension(inst.extensionId);
          if (!ext) return null;

          return (
            <Card key={idx} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg h-12 w-12 flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {ext.name}
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {inst.state}
                        </Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">v{inst.version} • Installed on {inst.installedAt.toLocaleDateString()}</p>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <ShieldAlert className="h-4 w-4" />
                          {inst.grantedPermissions.length} Scopes Granted
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          Healthy (Last ping: 2 mins ago)
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          124 executions (24h)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent">
                      Disable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {installed.length === 0 && (
          <div className="text-center py-12 border rounded-xl bg-muted/10">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No extensions installed</h3>
            <p className="text-muted-foreground mt-1">Visit the Marketplace to discover capabilities for your organization.</p>
            <Button onClick={() => router.push('/marketplace')} className="mt-4">Browse Marketplace</Button>
          </div>
        )}
      </div>
    </div>
  );
}
