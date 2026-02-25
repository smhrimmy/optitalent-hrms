'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Plus, Trash2, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";

type Role = {
    title: string;
    description: string;
};

export function ConfigureWalkInDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form State
    const [title, setTitle] = useState('Walk-In Drive Registration');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('16:00');
    const [location, setLocation] = useState('OptiTalent Towers, Bangalore');
    const [isActive, setIsActive] = useState(true);
    const [roles, setRoles] = useState<Role[]>([
        { title: "Chat Support Agent", description: "Provide top-notch support to customers via live chat." }
    ]);

    // Fetch existing config on open
    useEffect(() => {
        if (open) {
            fetchConfig();
        }
    }, [open]);

    const fetchConfig = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', user.id).single();
        if (!userData) return;

        // Fetch latest event
        const { data } = await supabase
            .from('walkin_events')
            .select('*')
            .eq('tenant_id', userData.tenant_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            setTitle(data.title);
            setDate(data.date);
            setStartTime(data.start_time);
            setEndTime(data.end_time);
            setLocation(data.location);
            setIsActive(data.is_active);
            setRoles(data.roles as Role[] || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', user.id).single();
            if (!userData) throw new Error("User data not found");

            // We'll just insert a new record for history tracking, or update if we wanted to be efficient.
            // Let's insert a new one to keep it simple and safe (append-only log essentially for "latest" query)
            // Actually, updating the existing active one or inserting if none exists is better to avoid clutter.
            // Let's Insert always for now to simplify "latest" logic, effectively creating a new version.
            
            const { error } = await supabase.from('walkin_events').insert({
                tenant_id: userData.tenant_id,
                title,
                date,
                start_time: startTime,
                end_time: endTime,
                location,
                roles,
                is_active: isActive
            });

            if (error) throw error;

            toast({ title: "Success", description: "Walk-in drive configuration updated." });
            setOpen(false);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const addRole = () => {
        setRoles([...roles, { title: '', description: '' }]);
    };

    const removeRole = (index: number) => {
        setRoles(roles.filter((_, i) => i !== index));
    };

    const updateRole = (index: number, field: keyof Role, value: string) => {
        const newRoles = [...roles];
        newRoles[index][field] = value;
        setRoles(newRoles);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" /> Configure Page
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configure Walk-In Drive Page</DialogTitle>
                    <DialogDescription>Update the details shown on the public registration page.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-sm text-muted-foreground">Enable or disable the registration page.</p>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Page Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Open Roles</Label>
                            <Button size="sm" variant="ghost" onClick={addRole}><Plus className="h-4 w-4 mr-2" /> Add Role</Button>
                        </div>
                        {roles.map((role, index) => (
                            <div key={index} className="flex gap-2 items-start p-3 border rounded-md">
                                <div className="grid gap-2 flex-1">
                                    <Input 
                                        placeholder="Role Title" 
                                        value={role.title} 
                                        onChange={(e) => updateRole(index, 'title', e.target.value)} 
                                    />
                                    <Textarea 
                                        placeholder="Description" 
                                        value={role.description} 
                                        onChange={(e) => updateRole(index, 'description', e.target.value)}
                                        className="h-20"
                                    />
                                </div>
                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeRole(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
