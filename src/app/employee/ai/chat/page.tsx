'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, User, ArrowUp, ArrowLeft, RefreshCw, AlertCircle, FileText, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ChatContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q');
    
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', type: 'text', content: "Hello. I'm your OptiTalent Workforce Assistant. I can help you understand your HR information, complete eligible requests, and plan your development. What do you need help with?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle initial query from Home Page
    useEffect(() => {
        if (initialQuery && messages.length === 1) {
            handleSend(initialQuery);
        }
    }, [initialQuery]);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user', type: 'text', content: text }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Processing & Response
        setTimeout(() => {
            const aiResponse = simulateAIResponse(text);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const simulateAIResponse = (query: string) => {
        const q = query.toLowerCase();

        // 1. Leave / Calendar Assistant
        if (q.includes('leave') || q.includes('holiday')) {
            return {
                role: 'assistant',
                type: 'action',
                content: "I checked your current balance. You are eligible to take Annual Leave.",
                evidence: "Current Balance: 8 Days (Annual Leave)",
                actionLabel: "Prepare leave request",
                actionHref: "/employee/requests/new?type=leave",
                actionType: "REQUIRES APPROVAL",
                icon: <Calendar className="h-4 w-4" />
            };
        }

        // 2. Career / Learning Assistant
        if (q.includes('learn') || q.includes('career') || q.includes('target role')) {
            return {
                role: 'assistant',
                type: 'recommendation',
                content: "Based on your target role (Senior Software Engineer), you have a skill gap in Cloud Architecture.",
                evidence: "Role Readiness: 72%. Verified Skills: Backend Engineering. Missing: Advanced Cloud Systems.",
                recommendation: "I recommend completing the AWS Architecture course.",
                actionLabel: "View Course",
                actionHref: "/employee/learning",
                icon: <GraduationCap className="h-4 w-4" />
            };
        }

        // 3. Document / Compliance Assistant
        if (q.includes('document') || q.includes('expir')) {
            return {
                role: 'assistant',
                type: 'fact',
                content: "You have one document expiring soon that requires your attention.",
                evidence: "Information Security Policy Acknowledgement expires in 30 days.",
                actionLabel: "Update document",
                actionHref: "/employee/documents/required",
                icon: <FileText className="h-4 w-4" />
            };
        }

        // 4. Default / Tasks
        return {
            role: 'assistant',
            type: 'fact',
            content: "You have 2 pending tasks today: Complete security training and update your identity document.",
            evidence: "Source: Action Center",
            actionLabel: "Go to Inbox",
            actionHref: "/employee/inbox",
            icon: <Briefcase className="h-4 w-4" />
        };
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-140px)] max-w-4xl mx-auto border rounded-xl overflow-hidden bg-background">
            
            {/* Header */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-muted/30 shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" asChild>
                        <Link href="/employee/ai"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="flex items-center gap-2 font-medium">
                        <Bot className="h-4 w-4 text-purple-600" />
                        OptiTalent AI
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background border px-2 py-1 rounded-md">
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    Permission Aware
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-purple-100 text-purple-700'}`}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        
                        <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            
                            {/* Standard Text Response */}
                            {msg.type === 'text' && (
                                <div className={`px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border rounded-tl-sm text-foreground'}`}>
                                    {msg.content}
                                </div>
                            )}

                            {/* Structured AI Response Cards */}
                            {msg.role === 'assistant' && msg.type !== 'text' && (
                                <Card className="w-full border-purple-100 shadow-sm overflow-hidden rounded-tl-sm">
                                    <div className={`h-1 w-full ${msg.type === 'action' ? 'bg-blue-400' : msg.type === 'recommendation' ? 'bg-purple-400' : 'bg-slate-400'}`} />
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-muted rounded-md text-muted-foreground mt-0.5">
                                                {msg.icon}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider mb-1 flex gap-2 items-center text-muted-foreground">
                                                    {msg.type}
                                                    {msg.actionType === 'REQUIRES APPROVAL' && (
                                                        <span className="bg-orange-100 text-orange-800 px-1.5 rounded text-[10px]">Requires Approval</span>
                                                    )}
                                                </div>
                                                <p className="font-medium">{msg.content}</p>
                                            </div>
                                        </div>

                                        {msg.evidence && (
                                            <div className="bg-muted/50 p-3 rounded-md border text-sm mt-2">
                                                <span className="font-semibold block mb-0.5 text-xs uppercase text-muted-foreground">Evidence / Source</span>
                                                <span className="text-muted-foreground">{msg.evidence}</span>
                                            </div>
                                        )}

                                        {msg.recommendation && (
                                            <div className="bg-purple-50 p-3 rounded-md border border-purple-100 text-sm text-purple-900 mt-2">
                                                {msg.recommendation}
                                            </div>
                                        )}

                                        {msg.actionLabel && (
                                            <div className="pt-2">
                                                <Button size="sm" asChild className="w-full sm:w-auto">
                                                    <Link href={msg.actionHref}>{msg.actionLabel}</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted/50 border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 w-fit">
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-end gap-2 bg-muted/30 border rounded-xl p-1 focus-within:ring-1 focus-within:ring-ring focus-within:border-primary transition-all"
                >
                    <Input 
                        placeholder="Ask OptiTalent AI..." 
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-h-[44px]"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isTyping}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        className="h-10 w-10 shrink-0 rounded-lg mb-0.5 mr-0.5"
                        disabled={!inputValue.trim() || isTyping}
                    >
                        <ArrowUp className="h-5 w-5" />
                    </Button>
                </form>
                <div className="text-[10px] text-center text-muted-foreground/60 mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    AI can make mistakes. All mutations require your final approval.
                </div>
            </div>

        </div>
    );
}

// Ensure ShieldCheck is available for the UI
function ShieldCheck(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
}

export default function EmployeeAIChatOS() {
    return (
        <div className="p-4 md:p-6">
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading AI context...</div>}>
                <ChatContent />
            </Suspense>
        </div>
    );
}
