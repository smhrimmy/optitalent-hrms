'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmployeeContextService, EmployeeProfile } from '@/lib/employee/domain';
import { EditableField } from '@/components/employee/EditableField';
import { ProfileCompleteness } from '@/components/employee/ProfileCompleteness';
import { Shield, Building2, User, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeProfileOS() {
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContext() {
            setLoading(true);
            const prof = await EmployeeContextService.getProfile('emp-1');
            setProfile(prof);
            setLoading(false);
        }
        fetchContext();
    }, []);

    const handleSavePhone = async (newVal: string) => {
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setProfile(prev => prev ? { ...prev, phone: newVal } : null);
    };

    const handleRequestChange = () => {
        toast.info("Change Request Created. HR will review your request.", {
            icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
    };

    if (loading || !profile) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your personal information and employment details.
                </p>
            </div>

            <ProfileCompleteness score={profile.completenessScore} missingFields={profile.missingFields} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-muted-foreground" /> Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EditableField 
                            label="First Name" 
                            value={profile.firstName} 
                            editable={false} 
                            controlledByHR={true} 
                            onRequestChange={handleRequestChange}
                        />
                        <EditableField 
                            label="Last Name" 
                            value={profile.lastName} 
                            editable={false} 
                            controlledByHR={true} 
                            onRequestChange={handleRequestChange}
                        />
                        <EditableField 
                            label="Contact Number" 
                            value={profile.phone || 'Not provided'} 
                            editable={true} 
                            onSave={handleSavePhone}
                        />
                        <EditableField 
                            label="Personal Email" 
                            value="ravi.k.home@example.com" 
                            editable={true} 
                            onSave={async () => { await new Promise(r => setTimeout(r, 500)); }}
                        />
                    </CardContent>
                </Card>

                {/* Employment Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-muted-foreground" /> Employment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EditableField 
                            label="Job Title" 
                            value={profile.title} 
                            editable={false} 
                            controlledByHR={true} 
                        />
                        <EditableField 
                            label="Department" 
                            value={profile.department} 
                            editable={false} 
                            controlledByHR={true} 
                        />
                        <EditableField 
                            label="Manager" 
                            value={profile.managerName || 'Unassigned'} 
                            editable={false} 
                            controlledByHR={true} 
                        />
                        <EditableField 
                            label="Start Date" 
                            value={new Date(profile.startDate).toLocaleDateString()} 
                            editable={false} 
                            controlledByHR={true} 
                        />
                    </CardContent>
                </Card>

                {/* Security & Access */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-muted-foreground" /> Security & Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EditableField 
                            label="Work Email" 
                            value={profile.email} 
                            editable={false} 
                            controlledByHR={true} 
                            onRequestChange={handleRequestChange}
                        />
                        <div className="pt-4 border-t flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div>
                                <h4 className="font-medium text-sm">Two-Factor Authentication</h4>
                                <p className="text-xs text-muted-foreground">Secure your account with 2FA.</p>
                            </div>
                            <Button variant="outline" size="sm">Enable 2FA</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
