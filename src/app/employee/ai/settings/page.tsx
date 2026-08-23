'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bot, History, Sparkles, BookOpen, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AIPreferencesPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
                <Link href="/employee/ai"><ArrowLeft className="h-4 w-4" /> Back to AI Home</Link>
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Privacy & Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Control how OptiTalent AI interacts with your employee data.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="space-y-6">
                
                {/* Core AI Setting */}
                <Card className="border-purple-200">
                    <CardHeader className="pb-3 border-b bg-purple-50/50">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-purple-600" />
                            <CardTitle className="text-lg">AI Assistance</CardTitle>
                        </div>
                        <CardDescription>Enable or disable the Workforce Assistant completely.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Enable OptiTalent AI</Label>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Disabling this will turn off the AI chat and all proactive AI insights. Standard HR features and workflows will remain fully functional.
                                </p>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* Proactive Insights */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-lg">Proactive Insights</CardTitle>
                        </div>
                        <CardDescription>Allow the AI to analyze your authorized HR data to provide recommendations.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex gap-3">
                                <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-base">Learning Recommendations</Label>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Suggest courses based on your verified skills and target role gaps.
                                    </p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex gap-3">
                                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-base">Career Progress Insights</Label>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Calculate role readiness and suggest development goals.
                                    </p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-base">Document & Deadline Reminders</Label>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Remind you of expiring compliance documents or pending mandatory tasks.
                                    </p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                    </CardContent>
                </Card>

                {/* Data & Memory */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Conversation History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Save Chat History</Label>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Allow the AI to remember the context of your previous conversations.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        
                        <div className="pt-4 border-t">
                            <Button variant="destructive" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                                Clear Conversation History
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Usage Disclosure */}
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground border">
                    <h4 className="font-semibold text-foreground mb-1">Data Disclosure</h4>
                    OptiTalent AI operates within your exact permission boundaries. It can only see data that you are already authorized to access (like your own salary, goals, and documents). It cannot modify records without your explicit `[Submit]` confirmation, and it cannot access data belonging to other employees or managers.
                </div>
            </div>
        </div>
    );
}
