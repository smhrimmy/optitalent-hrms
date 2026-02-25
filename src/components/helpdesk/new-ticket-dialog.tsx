
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categorizeTicketAction } from '@/app/[role]/helpdesk/actions';
import type { Ticket } from '@/app/[role]/helpdesk/page';
import { supabase } from '@/lib/supabase';

export function NewTicketDialog({ onNewTicket }: { onNewTicket: (ticket: Ticket) => void}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;

        if (!subject || !description) {
            toast({
                title: "Missing Information",
                description: "Please fill out all fields to create a ticket.",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }

        try {
            const aiResult = await categorizeTicketAction({ subject, description });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: userData } = await supabase.from('users').select('tenant_id, employees(id)').eq('id', user.id).single();
            if (!userData?.tenant_id || !userData.employees?.[0]?.id) throw new Error("Employee profile not found");

            // 1. Create Ticket
            const { data: ticketData, error: ticketError } = await supabase.from('helpdesk_tickets').insert({
                tenant_id: userData.tenant_id,
                employee_id: userData.employees[0].id,
                subject,
                description,
                category: aiResult.category,
                priority: aiResult.priority,
                status: 'Open'
            }).select().single();

            if (ticketError) throw ticketError;

            // 2. Create Initial Message (User Description)
            const { error: msgError } = await supabase.from('helpdesk_messages').insert({
                tenant_id: userData.tenant_id,
                ticket_id: ticketData.id,
                sender_id: userData.employees[0].id,
                message: description
            });

            if (msgError) throw msgError;

            // 3. Create System Message (AI Categorization)
            // Ideally system messages shouldn't need a sender_id, or we use a system bot ID.
            // For now, let's skip the system message in DB or use the user as sender but mark it 'system' in UI if we had a type column.
            // Our schema requires sender_id referencing employees. 
            // We'll skip persisting the "AI categorized" message to DB to avoid "fake" employee references, 
            // or we could add a `is_system` boolean to messages table later.
            // For now, just the user message is enough.

            const newTicket: Ticket = {
                id: ticketData.id,
                subject,
                department: aiResult.category,
                priority: aiResult.priority,
                status: 'Open',
                lastUpdate: 'Just now',
                messages: [
                    { from: 'user', text: description, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { from: 'system', text: `AI has categorized this ticket as "${aiResult.category}" with ${aiResult.priority} priority.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]
            };
    
            onNewTicket(newTicket);
            toast({
                title: "Ticket Created!",
                description: `Your ticket has been submitted and categorized by AI.`
            });
            setOpen(false);
        } catch(err: any) {
            console.error(err);
            toast({
                title: "Submission Failed",
                description: err.message || "Could not create ticket.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Ticket</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Ticket</DialogTitle>
                    <DialogDescription>Describe your issue. Our AI will automatically route it to the right department.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" placeholder="e.g., Password Reset" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Please describe your issue in detail." required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
