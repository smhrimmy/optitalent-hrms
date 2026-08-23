'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
    Calendar, 
    Clock, 
    Lock, 
    Users, 
    Plus,
    Bot,
    CheckSquare,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const mockCheckIns = [
    {
        id: '1',
        employee: 'Sarah Chen',
        date: 'Today, 2:00 PM',
        status: 'Upcoming',
        sharedAgenda: ['Review Q3 API Goals', 'Blockers on deployment'],
        privateNotes: 'Need to discuss potential promotion track if Q3 goals are met. Do not mention until calibration.',
        actionItems: [
            { text: 'Sarah to review architecture doc', completed: false }
        ]
    },
    {
        id: '2',
        employee: 'Marcus Johnson',
        date: 'Tomorrow, 10:00 AM',
        status: 'Upcoming',
        sharedAgenda: ['Overtime discussion', 'Support rotation'],
        privateNotes: 'Marcus seems disengaged. Flight risk high. Need to gently probe on workload.',
        actionItems: []
    }
];

export default function ManagerOneOnOnesPage() {
    const { toast } = useToast();
    const [selectedMeeting, setSelectedMeeting] = useState(mockCheckIns[0]);
    const [privateNoteInput, setPrivateNoteInput] = useState(selectedMeeting.privateNotes);
    const [sharedNoteInput, setSharedNoteInput] = useState('');

    const handleSavePrivateNotes = () => {
        toast({
            title: "Private notes saved",
            description: "These notes are encrypted and only visible to you.",
        });
    };

    const handleGenerateAiAgenda = () => {
        toast({
            title: "AI Agenda Generated",
            description: "Pulled context from recent feedback and at-risk goals.",
        });
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-6rem)]">
            
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">1:1 OS</h1>
                    <p className="text-muted-foreground mt-1">Continuous check-ins, agendas, and private notes.</p>
                </div>
                <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                    <Calendar className="h-4 w-4" /> Schedule Check-in
                </Button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                
                {/* Left Panel - Meeting List */}
                <Card className="md:w-1/3 flex flex-col h-full overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b pb-4 shrink-0">
                        <CardTitle className="text-lg">Upcoming Check-ins</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto flex-1">
                        <div className="divide-y">
                            {mockCheckIns.map(meeting => (
                                <button 
                                    key={meeting.id} 
                                    className={`w-full text-left p-4 transition-colors hover:bg-slate-50 flex items-start gap-3 ${selectedMeeting.id === meeting.id ? 'bg-slate-50 border-l-4 border-l-primary' : ''}`}
                                    onClick={() => {
                                        setSelectedMeeting(meeting);
                                        setPrivateNoteInput(meeting.privateNotes);
                                    }}
                                >
                                    <Avatar className="h-10 w-10 border shadow-sm">
                                        <AvatarFallback className="bg-white text-slate-600 font-medium">
                                            {meeting.employee.split(' ').map(n=>n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900">{meeting.employee}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {meeting.date}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Panel - Meeting Workspace */}
                <Card className="md:w-2/3 flex flex-col h-full overflow-hidden shadow-md border-slate-200">
                    
                    {/* Workspace Header */}
                    <CardHeader className="border-b bg-white shrink-0 flex flex-row items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border shadow-sm">
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-bold">
                                    {selectedMeeting.employee.split(' ').map(n=>n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{selectedMeeting.employee}</CardTitle>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Clock className="h-3.5 w-3.5" /> {selectedMeeting.date}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100" onClick={handleGenerateAiAgenda}>
                            <Bot className="h-4 w-4" /> Prepare with AI
                        </Button>
                    </CardHeader>

                    {/* Dual Pane Layout (Shared vs Private) */}
                    <CardContent className="flex-1 p-0 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
                        
                        {/* Shared Space (Employee Visible) */}
                        <div className="flex-1 border-b md:border-b-0 md:border-r p-6 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-4 text-slate-700">
                                <Users className="h-5 w-5" />
                                <h3 className="font-semibold">Shared Agenda & Notes</h3>
                                <Badge variant="outline" className="ml-auto bg-white">Visible to {selectedMeeting.employee.split(' ')[0]}</Badge>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-white border rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                        <CheckSquare className="h-4 w-4 text-slate-400" /> Agenda Items
                                    </h4>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        {selectedMeeting.sharedAgenda.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground border border-dashed">
                                        <Plus className="h-4 w-4 mr-2" /> Add Agenda Item
                                    </Button>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Meeting Notes</h4>
                                    <Textarea 
                                        placeholder="Type shared notes here during the meeting..."
                                        className="min-h-[150px] bg-white resize-none"
                                        value={sharedNoteInput}
                                        onChange={(e) => setSharedNoteInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Private Space (Manager Only) */}
                        <div className="flex-1 p-6 bg-slate-100/50 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-4 text-slate-700">
                                <Lock className="h-5 w-5 text-amber-600" />
                                <h3 className="font-semibold">Private Manager Notes</h3>
                                <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200 text-[10px] uppercase">Highly Confidential</Badge>
                            </div>
                            
                            <div className="space-y-4 h-[calc(100%-3rem)] flex flex-col">
                                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-2">
                                    These notes are cryptographically isolated to your manager company. They cannot be requested by or surfaced to the employee.
                                </div>
                                <Textarea 
                                    placeholder="Type private thoughts, calibration notes, or flight-risk assessments here..."
                                    className="flex-1 bg-white resize-none border-amber-200 focus-visible:ring-amber-500 min-h-[250px]"
                                    value={privateNoteInput}
                                    onChange={(e) => setPrivateNoteInput(e.target.value)}
                                />
                                <Button className="w-full bg-slate-900" onClick={handleSavePrivateNotes}>Save Private Notes</Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
