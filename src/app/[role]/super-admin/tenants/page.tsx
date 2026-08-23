'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  Users, 
  MoreHorizontal, 
  Plus, 
  ShieldCheck, 
  Server,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { provisionCompany } from '@/lib/supabase-admin'; // We need this later

export default function CompanyManagement() {
  const [companys, setCompanys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // New Company Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyPlan, setNewCompanyPlan] = useState('Startup');
  const [newCompanySlug, setNewCompanySlug] = useState('');

  useEffect(() => {
    fetchCompanys();
  }, []);

  const fetchCompanys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('companys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
        // Mock user count for now as it requires join or separate query
        const companysWithCounts = data.map(t => ({
            ...t,
            userCount: Math.floor(Math.random() * 50) + 5 // Mock
        }));
        setCompanys(companysWithCounts);
    }
    setLoading(false);
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName || !newCompanySlug) return;

    // In a real app, this calls a Supabase Edge Function to create company + admin user
    // For now, we just insert into companys table (if RLS allows, but usually super-admin only)
    
    try {
        const { data, error } = await supabase.from('companys').insert({
            name: newCompanyName,
            slug: newCompanySlug,
            plan: newCompanyPlan,
            status: 'Active'
        }).select().single();

        if (error) throw error;

        toast({ title: "Company Created", description: `${newCompanyName} has been provisioned successfully.` });
        fetchCompanys();
        setIsDialogOpen(false);
        setNewCompanyName('');
        setNewCompanySlug('');
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
      const { error } = await supabase.from('companys').update({ status }).eq('id', id);
      if (!error) {
          setCompanys(companys.map(t => t.id === id ? { ...t, status } : t));
          toast({ title: "Status Updated", description: `Company status changed to ${status}.` });
      }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" /> Company Management
          </h1>
          <p className="text-muted-foreground">Provision, monitor, and manage customer workspaces.</p>
        </div>
        <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Provision Company
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Provision New Company</DialogTitle>
                        <DialogDescription>Create a new workspace environment.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={newCompanyName} onChange={e => {
                                setNewCompanyName(e.target.value);
                                setNewCompanySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                            }} placeholder="Acme Corp" />
                        </div>
                        <div className="space-y-2">
                            <Label>URL Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">optitalent.com/</span>
                                <Input value={newCompanySlug} onChange={e => setNewCompanySlug(e.target.value)} placeholder="acme-corp" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subscription Plan</Label>
                            <Select value={newCompanyPlan} onValueChange={setNewCompanyPlan}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Startup">Startup ($499/mo)</SelectItem>
                                    <SelectItem value="Business">Business ($999/mo)</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise ($2999/mo)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCompany}>Provision</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Companys ({companys.length})</CardTitle>
            <CardDescription>List of all registered organizations.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companys.map((company) => (
                        <TableRow key={company.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{company.name}</span>
                                    <span className="text-xs text-muted-foreground">/{company.slug}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{company.plan}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={company.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}>
                                    {company.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{company.userCount}</TableCell>
                            <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem><Server className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                        <DropdownMenuItem><ShieldCheck className="mr-2 h-4 w-4" /> Security Audit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {company.status === 'Active' ? (
                                            <DropdownMenuItem className="text-yellow-600" onClick={() => handleStatusChange(company.id, 'Suspended')}>
                                                <Ban className="mr-2 h-4 w-4" /> Suspend Company
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem className="text-green-600" onClick={() => handleStatusChange(company.id, 'Active')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Activate Company
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Company
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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