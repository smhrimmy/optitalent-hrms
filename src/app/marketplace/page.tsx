'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Bot, Building2, PackageSearch, ShieldCheck, Download } from 'lucide-react';
import { ExtensionRegistry } from '@/lib/marketplace/registry';
import { ExtensionManifest } from '@/lib/marketplace/manifest';

export default function MarketplaceDiscovery() {
  const [selectedExtension, setSelectedExtension] = useState<ExtensionManifest | null>(null);
  
  const catalog = ExtensionRegistry.getCatalog();

  const getIcon = (type: string) => {
    if (type === 'AI_AGENT') return <Bot className="h-8 w-8 text-blue-500" />;
    if (type === 'INDUSTRY_PACK') return <Building2 className="h-8 w-8 text-indigo-500" />;
    return <PackageSearch className="h-8 w-8 text-orange-500" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border">
        <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-extrabold tracking-tight">OptiTalent Marketplace</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Extend your Workforce OS with verified AI Agents, Industry Packs, and Integrations. 
          All extensions run securely within your company's permission boundaries.
        </p>
      </div>

      {!selectedExtension ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map(ext => (
            <Card key={ext.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedExtension(ext)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  {getIcon(ext.type)}
                  {ext.isPremium && <Badge variant="secondary" className="bg-amber-100 text-amber-800">{ext.tier}</Badge>}
                </div>
                <CardTitle className="mt-4">{ext.name}</CardTitle>
                <CardDescription>by {ext.publisher}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
                  {ext.description}
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">{ext.type.replace('_', ' ')}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto border-primary/20">
          <CardHeader className="bg-muted/30 pb-8">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  {getIcon(selectedExtension.type)}
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedExtension.name}</CardTitle>
                  <CardDescription className="text-base mt-1">by {selectedExtension.publisher}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Verified Publisher</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedExtension(null)}>Back</Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" /> Install
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{selectedExtension.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Permissions Requested</h3>
                <ul className="space-y-2">
                  {selectedExtension.requiredPermissions.map(p => (
                    <li key={p} className="text-sm font-mono bg-muted/50 p-2 rounded">{p}</li>
                  ))}
                  {selectedExtension.requiredPermissions.length === 0 && (
                    <li className="text-sm text-muted-foreground">No data access required.</li>
                  )}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Event Subscriptions</h3>
                <ul className="space-y-2">
                  {selectedExtension.eventSubscriptions.map(e => (
                    <li key={e} className="text-sm font-mono bg-muted/50 p-2 rounded">{e}</li>
                  ))}
                  {selectedExtension.eventSubscriptions.length === 0 && (
                    <li className="text-sm text-muted-foreground">No events requested.</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
