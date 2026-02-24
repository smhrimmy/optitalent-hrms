
'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Search, ShieldBan, Trash2, LogIn, HardDrive } from 'lucide-react';

// ... imports

type Tenant = {
  id: string;
  name: string;
  domain: string;
  plan: 'Enterprise' | 'Business' | 'Starter';
  users: number;
  maxUsers: number;
  storage: number; // in GB
  maxStorage: number; // in GB
  status: 'Active' | 'Suspended' | 'Pending';
  created: string;
};

const initialTenants: Tenant[] = [
  { id: 't_001', name: 'Acme Corp', domain: 'acme.optitalent.com', plan: 'Enterprise', users: 1250, maxUsers: 5000, storage: 450, maxStorage: 1000, status: 'Active', created: '2025-01-10' },
  { id: 't_002', name: 'Stark Industries', domain: 'stark.optitalent.com', plan: 'Enterprise', users: 5400, maxUsers: 10000, storage: 2100, maxStorage: 5000, status: 'Active', created: '2025-01-12' },
  { id: 't_003', name: 'Wayne Enterprises', domain: 'wayne.optitalent.com', plan: 'Business', users: 800, maxUsers: 1000, storage: 120, maxStorage: 500, status: 'Active', created: '2025-02-05' },
  { id: 't_004', name: 'Cyberdyne Systems', domain: 'cyberdyne.optitalent.com', plan: 'Starter', users: 45, maxUsers: 50, storage: 5, maxStorage: 20, status: 'Suspended', created: '2025-02-15' },
];

export default function TenantManagementPage() {
  // ... existing state ...

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    
    const newTenant: Tenant = {
        id: `t_${Date.now()}`,
        name,
        domain: `${name.toLowerCase().replace(/\s/g, '')}.optitalent.com`,
        plan: 'Starter',
        users: 1,
        maxUsers: 50,
        storage: 0,
        maxStorage: 20,
        status: 'Active',
        created: new Date().toISOString().split('T')[0]
    };
    
    setTenants([newTenant, ...tenants]);
    toast({ title: "Tenant Created", description: `${name} has been provisioned successfully.` });
  };

  const handleImpersonate = (tenant: Tenant) => {
      toast({ title: "Impersonating Owner", description: `Logging in as Root Admin for ${tenant.name}...` });
      // Logic to switch auth token would go here
  };
  
  // ... existing filtered logic ...

  return (
    <div className="space-y-6 p-6">
      {/* ... header ... */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users / Quota</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="font-mono text-xs">{tenant.domain}</TableCell>
                <TableCell><Badge variant="outline">{tenant.plan}</Badge></TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">{tenant.users} / {tenant.maxUsers}</span>
                        <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(tenant.users / tenant.maxUsers) * 100}%` }} />
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">{tenant.storage}GB / {tenant.maxStorage}GB</span>
                         <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(tenant.storage / tenant.maxStorage) * 100}%` }} />
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={tenant.status === 'Active' ? 'default' : 'destructive'} className={tenant.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : ''}>
                        {tenant.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleImpersonate(tenant)}>
                         <LogIn className="mr-2 h-4 w-4" /> Impersonate Owner
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(tenant.id, 'Suspend')}>
                         <ShieldBan className="mr-2 h-4 w-4" /> {tenant.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleAction(tenant.id, 'Delete')}>
                         <Trash2 className="mr-2 h-4 w-4" /> Delete Tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
