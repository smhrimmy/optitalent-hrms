'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Mail, Smartphone, ShieldAlert, Moon } from 'lucide-react';
import Link from 'next/link';

export default function NotificationPreferencesPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
                <Link href="/employee/notifications"><ArrowLeft className="h-4 w-4" /> Back to Notifications</Link>
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notification Preferences</h1>
                    <p className="text-muted-foreground mt-1">
                        Control how and when you receive updates from the Workplace OS.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="space-y-6">
                
                {/* Quiet Hours */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <Moon className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-lg">Quiet Hours</CardTitle>
                        </div>
                        <CardDescription>Mute non-urgent notifications during specific times.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="quiet-hours-toggle" className="text-base">Enable Quiet Hours</Label>
                            <Switch id="quiet-hours-toggle" defaultChecked />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <input type="time" id="start-time" defaultValue="22:00" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <input type="time" id="end-time" defaultValue="07:00" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Channels */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg">Delivery Channels</CardTitle>
                        <CardDescription>Configure where you want to receive updates by category.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 py-3 border-b text-sm font-medium text-muted-foreground hidden sm:grid">
                            <div className="col-span-6">Category</div>
                            <div className="col-span-2 text-center flex justify-center"><Bell className="h-4 w-4" title="In-App" /></div>
                            <div className="col-span-2 text-center flex justify-center"><Mail className="h-4 w-4" title="Email" /></div>
                            <div className="col-span-2 text-center flex justify-center"><Smartphone className="h-4 w-4 text-muted-foreground/50" title="Push (Coming Soon)" /></div>
                        </div>

                        {/* Security/Critical (Locked) */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 border-b items-center">
                            <div className="col-span-6 space-y-1">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-destructive" />
                                    <Label className="font-semibold text-destructive">Security & Compliance</Label>
                                </div>
                                <p className="text-xs text-muted-foreground">Critical alerts, password resets, mandatory compliance.</p>
                            </div>
                            <div className="col-span-6 sm:col-span-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
                                <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2"><Switch disabled checked /> <span className="sm:hidden text-xs text-muted-foreground">App</span></div>
                                <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2"><Switch disabled checked /> <span className="sm:hidden text-xs text-muted-foreground">Email</span></div>
                                <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2"><Switch disabled /> <span className="sm:hidden text-xs text-muted-foreground">Push</span></div>
                            </div>
                        </div>

                        {/* Categories */}
                        {[
                            { name: 'Approvals & Requests', desc: 'Leave requests, expenses, workflow approvals.' },
                            { name: 'Payroll & Benefits', desc: 'Payslips generated, enrollment periods.' },
                            { name: 'Performance & Goals', desc: 'Goal updates, review cycles, feedback.' },
                            { name: 'Learning & Career', desc: 'Course assignments, career readiness insights.' },
                            { name: 'AI Workforce Insights', desc: 'Automated insights and recommendations.' }
                        ].map((category, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 border-b last:border-0 items-center">
                                <div className="col-span-6 space-y-1">
                                    <Label className="font-semibold text-base">{category.name}</Label>
                                    <p className="text-xs text-muted-foreground">{category.desc}</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
                                    <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2">
                                        <Switch defaultChecked /> 
                                        <span className="sm:hidden text-xs text-muted-foreground">App</span>
                                    </div>
                                    <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2">
                                        <Switch defaultChecked={idx < 2} /> 
                                        <span className="sm:hidden text-xs text-muted-foreground">Email</span>
                                    </div>
                                    <div className="sm:col-span-2 flex justify-start sm:justify-center items-center gap-2">
                                        <Switch disabled /> 
                                        <span className="sm:hidden text-xs text-muted-foreground">Push</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
