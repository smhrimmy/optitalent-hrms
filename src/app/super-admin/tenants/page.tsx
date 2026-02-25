
'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Search, ShieldBan, Trash2, LogIn, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Tenant = {
  id: string;
  name: string;
  domain: string; // Mapped to 'slug' in DB
  plan: 'Enterprise' | 'Business' | 'Starter'; // Mapped to 'plan' in DB
  users: number; // Count from users table
  maxUsers: number; // Hardcoded or DB
  storage: number; // Hardcoded or DB
  maxStorage: number; // Hardcoded or DB
  status: 'Active' | 'Suspended' | 'Pending';
  created_at: string;
};

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
      // 1. Auth Check (Super Admin Only)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (userData?.role !== 'super-admin') { router.push('/dashboard'); return; }

      // 2. Fetch Tenants
      const { data: tenantsData, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      
      if (error) {
          toast({ title: "Error fetching tenants", description: error.message, variant: "destructive" });
          return;
      }

      // 3. Enrich with User Counts
      const enrichedTenants = await Promise.all(tenantsData.map(async (t: any) => {
          const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('tenant_id', t.id);
          return {
              id: t.id,
              name: t.name,
              domain: t.slug, // DB column is slug
              plan: t.plan || 'Starter',
              users: count || 0,
              maxUsers: t.plan === 'Enterprise' ? 1000 : t.plan === 'Business' ? 100 : 20,
              storage: 0,
              maxStorage: t.plan === 'Enterprise' ? 1000 : 50,
              status: t.status || 'Active',
              created_at: t.created_at
          };
      }));

      setTenants(enrichedTenants);
      setLoading(false);
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const plan = (form.elements.namedItem('plan') as HTMLSelectElement).value;
    const adminEmail = (form.elements.namedItem('adminEmail') as HTMLInputElement).value;
    
    setLoading(true); // Show loading state on button ideally, but global loading is okay for now or use local submitting state

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
            return;
        }

        const response = await fetch('/api/tenants/provision', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ name, plan, adminEmail })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to provision tenant');
        }
        
        toast({ title: "Tenant Created", description: `${name} has been provisioned. Invite sent to ${adminEmail}.` });
        fetchTenants(); 
    } catch (error: any) {
        toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'Suspend' | 'Delete' | 'Restore') => {
      if (action === 'Suspend' || action === 'Restore') {
          const newStatus = action === 'Suspend' ? 'Suspended' : 'Active';
          const { error } = await supabase.from('tenants').update({ status: newStatus }).eq('id', id);
          if (error) {
               toast({ title: "Update Failed", description: error.message, variant: "destructive" });
          } else {
               toast({ title: "Status Updated", description: `Tenant ${action === 'Suspend' ? 'suspended' : 'restored'}.` });
               fetchTenants();
          }
      } else {
          if (!confirm("Are you sure? This will delete all users and data associated with this tenant.")) return;
          
          const { error } = await supabase.from('tenants').delete().eq('id', id);
          if (error) {
              toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
          } else {
              toast({ title: "Tenant Deleted", description: "All associated data has been purged." });
              fetchTenants();
          }
      }
  };

  const filtered = tenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.domain.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Tenant Management</h1>
          <p className="text-muted-foreground">Provision and manage company accounts.</p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4"/> Create Tenant</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Provision New Tenant</DialogTitle>
                    <DialogDescription>This will create a new isolated database schema and admin account.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTenant} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input id="name" name="name" placeholder="e.g. Globex Corporation" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@company.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="plan">Subscription Plan</Label>
                        <select id="plan" name="plan" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="Starter">Starter ($499/mo)</option>
                            <option value="Business">Business ($999/mo)</option>
                            <option value="Enterprise">Enterprise (Custom)</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Provision Tenant</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tenants..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

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
                            <div className="h-full bg-primary" style={{ width: `${Math.min((tenant.users / tenant.maxUsers) * 100, 100)}%` }} />
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">{tenant.storage}GB / {tenant.maxStorage}GB</span>
                         <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min((tenant.storage / tenant.maxStorage) * 100, 100)}%` }} />
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
                      <DropdownMenuItem onClick={() => toast({ title: "Coming Soon", description: "Impersonation is not yet implemented." })}>
                         <LogIn className="mr-2 h-4 w-4" /> Impersonate Owner
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(tenant.id, tenant.status === 'Active' ? 'Suspend' : 'Restore')}>
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
