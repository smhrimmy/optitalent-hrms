'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Bot, 
    Send, 
    Activity,
    Info,
    CheckCircle2,
    Zap,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';

export default function ManagerAiChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Hello. I have loaded your team's context spanning Performance, Capacity, and Hiring. What would you like to investigate?"
        },
        {
            id: 2,
            role: 'user',
            content: 'Why is engineering over capacity this week?'
        },
        {
            id: 3,
            role: 'assistant',
            type: 'structured',
            cards: [
                {
                    type: 'FACT',
                    icon: Info,
                    color: 'text-blue-700',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    content: 'Engineering is currently at 108% allocated capacity.'
                },
                {
                    type: 'SIGNAL',
                    icon: Activity,
                    color: 'text-orange-700',
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    content: 'Main contributors to the overload:',
                    list: [
                        'API Migration scope expansion (+18%)',
                        'Planned leave for 2 engineers (+7%)',
                        'New maintenance assignments (+6%)'
                    ]
                }
            ]
        },
        {
            id: 4,
            role: 'user',
            content: 'What happens if I move Priya to the API project?'
        },
        {
            id: 5,
            role: 'assistant',
            type: 'structured',
            cards: [
                {
                    type: 'SIMULATION',
                    icon: TrendingUp,
                    color: 'text-purple-700',
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    content: 'Moving Priya redistributes the capacity pressure.',
                    details: 'Current API Team: 115% → Simulated: 96%\nCurrent Maintenance Team: 71% → Simulated: 89%'
                },
                {
                    type: 'RECOMMENDATION',
                    icon: CheckCircle2,
                    color: 'text-green-700',
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    content: 'Reallocate Priya to the API Migration.'
                },
                {
                    type: 'REQUIRES APPROVAL',
                    icon: ShieldAlert,
                    color: 'text-red-700',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    content: 'Capacity reallocation requires formal workflow approval to notify project stakeholders.',
                    actionLabel: 'Prepare Reallocation Request'
                }
            ]
        }
    ]);

    const [input, setInput] = useState('');

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
            
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="p-3 bg-purple-100 rounded-xl">
                    <Bot className="h-8 w-8 text-purple-700" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ask Chief of Staff</h1>
                    <p className="text-muted-foreground mt-1">Context-aware team simulation and analysis.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && (
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-purple-100 text-purple-700"><Bot className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                        
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm px-5 py-3' : ''}`}>
                            {msg.role === 'user' ? (
                                <p>{msg.content}</p>
                            ) : (
                                msg.type === 'structured' ? (
                                    <div className="space-y-3">
                                        {msg.cards?.map((card, i) => {
                                            const Icon = card.icon;
                                            return (
                                                <Card key={i} className={`${card.border} shadow-sm overflow-hidden`}>
                                                    <div className={`${card.bg} px-4 py-2 border-b ${card.border} flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${card.color}`}>
                                                        <Icon className="h-4 w-4" /> {card.type}
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <p className="font-medium text-slate-900">{card.content}</p>
                                                        {card.list && (
                                                            <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc list-inside">
                                                                {card.list.map((li, j) => <li key={j}>{li}</li>)}
                                                            </ul>
                                                        )}
                                                        {card.details && (
                                                            <div className="mt-2 p-3 bg-slate-50 border rounded text-sm text-slate-700 font-mono whitespace-pre-wrap">
                                                                {card.details}
                                                            </div>
                                                        )}
                                                        {card.actionLabel && (
                                                            <div className="mt-4 pt-4 border-t flex justify-end">
                                                                <Button className="bg-slate-900">{card.actionLabel}</Button>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-800 leading-relaxed mt-1">{msg.content}</p>
                                )
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-slate-200 text-slate-700">M</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>

            <div className="shrink-0 pt-4 bg-white border-t mt-auto">
                <div className="flex gap-2 relative">
                    <Textarea 
                        aria-label="AI Prompt"
                        placeholder="Ask about team capacity, skills, or simulate a change..."
                        className="resize-none pr-12 min-h-[60px]"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button 
                        aria-label="Send" 
                        size="icon" 
                        className="absolute right-2 top-2 h-10 w-10 bg-purple-700 hover:bg-purple-800"
                        onClick={() => {
                            if (!input.trim()) return;
                            const newMessages = [...messages, { id: messages.length + 1, role: 'user', content: input }];
                            if (input.toLowerCase().includes('ignore')) {
                                newMessages.push({
                                    id: messages.length + 2,
                                    role: 'assistant',
                                    content: 'I do not have permission'
                                });
                            }
                            setMessages(newMessages as any);
                            setInput('');
                        }}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide text-xs">
                    <Button variant="outline" size="sm" className="shrink-0 text-slate-600 rounded-full bg-slate-50">Why is my team overloaded?</Button>
                    <Button variant="outline" size="sm" className="shrink-0 text-slate-600 rounded-full bg-slate-50">Which goals are at risk?</Button>
                    <Button variant="outline" size="sm" className="shrink-0 text-slate-600 rounded-full bg-slate-50">Prepare 1:1 for Marcus</Button>
                </div>
            </div>

        </div>
    );
}
