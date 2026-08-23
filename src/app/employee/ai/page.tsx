'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, FileText, CheckCircle2, GraduationCap, Briefcase, Workflow, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeAIHomeOS() {
    // Mock context summary data
    const contextSummary = {
        priorities: 2,
        learning: 1,
        documents: 1,
        careerReadiness: 72,
        requests: 1
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Workforce Assistant
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none">Beta</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        I can help you understand your HR information, complete eligible requests, and plan your development.
                    </p>
                </div>
            </div>

            {/* Conversation Entry Area */}
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none -translate-y-1/2 translate-x-1/4" />
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                            <Bot className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Good evening, User.</h2>
                            <p className="text-muted-foreground">How can I help you today?</p>
                        </div>
                    </div>

                    <Link href="/employee/ai/chat" className="block">
                        <div className="bg-background border rounded-xl p-4 flex items-center justify-between text-muted-foreground hover:border-purple-300 hover:shadow-sm transition-all cursor-text">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-5 w-5 text-purple-400" />
                                <span>Ask anything about your work life...</span>
                            </div>
                            <Button size="sm" variant="secondary" className="pointer-events-none">Start Chat</Button>
                        </div>
                    </Link>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background border-purple-200/50" asChild>
                            <Link href="/employee/ai/chat?q=What's on my HR to-do list?">What's on my HR to-do list?</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background border-purple-200/50" asChild>
                            <Link href="/employee/ai/chat?q=What should I learn next?">What should I learn next?</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background border-purple-200/50" asChild>
                            <Link href="/employee/ai/chat?q=Do I have any documents expiring soon?">Do I have any documents expiring soon?</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50 hover:bg-background border-purple-200/50" asChild>
                            <Link href="/employee/ai/chat?q=Where is my leave request?">Where is my leave request?</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Context Summary */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    Recent Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <Link href="/employee/ai/chat?q=Show my priorities">
                        <Card className="hover:shadow-md transition-all h-full group cursor-pointer border-orange-100">
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className="p-2 bg-orange-100 rounded-md shrink-0 text-orange-700">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">Action Required</h4>
                                    <p className="text-sm text-muted-foreground">{contextSummary.priorities} tasks need your attention today.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/employee/ai/chat?q=Which document is expiring?">
                        <Card className="hover:shadow-md transition-all h-full group cursor-pointer border-red-100">
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className="p-2 bg-red-100 rounded-md shrink-0 text-red-700">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">Documents</h4>
                                    <p className="text-sm text-muted-foreground">{contextSummary.documents} document expiring soon.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/employee/ai/chat?q=How can I reach my target role?">
                        <Card className="hover:shadow-md transition-all h-full group cursor-pointer border-sky-100">
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className="p-2 bg-sky-100 rounded-md shrink-0 text-sky-700">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">Career Readiness</h4>
                                    <p className="text-sm text-muted-foreground">You are {contextSummary.careerReadiness}% ready for your target role.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                </div>
            </div>

            {/* Quick Nav Links */}
            <div className="pt-8 flex gap-2 flex-wrap text-sm">
                <span className="text-muted-foreground flex items-center mr-2">Quick Access:</span>
                <Link href="/employee/inbox" className="text-primary hover:underline">My tasks</Link> • 
                <Link href="/employee/requests" className="text-primary hover:underline">My requests</Link> • 
                <Link href="/employee/documents" className="text-primary hover:underline">My documents</Link> • 
                <Link href="/employee/learning" className="text-primary hover:underline">My learning</Link> • 
                <Link href="/employee/career" className="text-primary hover:underline">My career</Link>
            </div>
            
            <div className="mt-8 text-xs text-muted-foreground/60 text-center">
                OptiTalent AI uses information you are authorized to access from your employee profile and HR services to answer questions and prepare eligible actions.
                <br />
                <Link href="/employee/ai/settings" className="hover:underline">Manage Privacy Settings</Link>
            </div>
        </div>
    );
}

// Ensure Badge is imported (mocked here if not globally available in this file yet)
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;
}
