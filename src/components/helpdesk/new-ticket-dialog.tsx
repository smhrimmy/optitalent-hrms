
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
import { Loader2, PlusCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categorizeTicketAction } from '@/app/[role]/helpdesk/actions';
import type { Ticket } from '@/app/[role]/helpdesk/page';
import { supabase } from '@/lib/supabase';

export function NewTicketDialog({ onNewTicket }: { onNewTicket: (ticket: Ticket) => void}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
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
            // ... (AI logic remains the same)
            let aiResult = { category: 'General Inquiry', priority: 'Medium' as 'High' | 'Medium' | 'Low' };
            try {
                const result = await categorizeTicketAction({ subject, description });
                if (result) aiResult = result;
            } catch (aiError) {
                console.warn("AI Categorization failed, using defaults:", aiError);
            }

            let userResult = await supabase.auth.getUser();
            let user = userResult.data.user;
            
            if (!user) {
                const sessionResult = await supabase.auth.getSession();
                user = sessionResult.data.session?.user || null;
            }

            if (!user) throw new Error("Not authenticated");

            const { data: userData } = await supabase.from('users').select('tenant_id, employees(id)').eq('id', user.id).single();
            if (!userData?.tenant_id || !userData.employees?.[0]?.id) throw new Error("Employee profile not found");

            // Upload file if exists
            let attachmentUrl = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userData.tenant_id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('helpdesk-attachments')
                    .upload(fileName, file);
                
                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage
                    .from('helpdesk-attachments')
                    .getPublicUrl(fileName);
                
                attachmentUrl = publicUrl;
            }

            // 1. Create Ticket
            const { data: ticketData, error: ticketError } = await supabase.from('helpdesk_tickets').insert({
                tenant_id: userData.tenant_id,
                employee_id: userData.employees[0].id,
                subject,
                description,
                category: aiResult.category,
                priority: aiResult.priority,
                status: 'Open',
                // attachment_url: attachmentUrl // Assume we added this column or append to description
            }).select('*, ticket_number').single();

            if (ticketError) throw ticketError;

            // 2. Create Initial Message
            const messageText = attachmentUrl 
                ? `${description}\n\n[Attachment](${attachmentUrl})` 
                : description;

            const { error: msgError } = await supabase.from('helpdesk_messages').insert({
                tenant_id: userData.tenant_id,
                ticket_id: ticketData.id,
                sender_id: userData.employees[0].id,
                message: messageText
            });

            if (msgError) throw msgError;

            const newTicket: Ticket = {
                id: ticketData.id,
                ticket_number: ticketData.ticket_number,
                subject,
                department: aiResult.category as any,
                priority: aiResult.priority,
                status: 'Open',
                lastUpdate: 'Just now',
                messages: [
                    { from: 'user', text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { from: 'system', text: `Ticket #${ticketData.ticket_number} created. AI has categorized this as "${aiResult.category}" with ${aiResult.priority} priority.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]
            };
    
            onNewTicket(newTicket);
            toast({
                title: "Ticket Created!",
                description: `Ticket #${ticketData.ticket_number} submitted successfully.`
            });
            setOpen(false);
            setFile(null);
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
                    <DialogDescription>Describe your issue. Attach proof if needed.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" placeholder="e.g., Change Request" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Please describe your issue in detail." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">Attachment (Proof)</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    id="file" 
                                    type="file" 
                                    className="cursor-pointer"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Upload images or documents to support your request.</p>
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
