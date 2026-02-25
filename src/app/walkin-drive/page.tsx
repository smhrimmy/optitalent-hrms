'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { MapPin, Calendar, Clock, Briefcase, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';

type WalkInEvent = {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    roles: { title: string; description: string }[];
};

export default function WalkInDrivePage() {
    const [event, setEvent] = useState<WalkInEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            const { data } = await supabase
                .from('walkin_events')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (data) {
                setEvent({
                    title: data.title,
                    date: new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    start_time: data.start_time,
                    end_time: data.end_time,
                    location: data.location,
                    roles: data.roles
                });
            }
            setLoading(false);
        };
        fetchEvent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
                 <div className="text-center space-y-4">
                    <Logo className="inline-flex" showText={true} />
                    <h1 className="text-2xl font-bold">No Active Walk-In Drives</h1>
                    <p className="text-muted-foreground">Please check back later for upcoming events.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <Logo className="inline-flex" showText={true} />
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{event.title}</h1>
                    <p className="text-muted-foreground text-lg">
                        Join our team! We're looking for talented individuals to fill a variety of roles.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
                         <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary"/>
                            <div>
                                <p className="font-semibold">Date</p>
                                <p className="text-muted-foreground">{event.date}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary"/>
                            <div>
                                <p className="font-semibold">Time</p>
                                <p className="text-muted-foreground">{event.start_time} - {event.end_time}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary"/>
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-muted-foreground">{event.location}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Open Roles</CardTitle>
                        <CardDescription>We are hiring for the following positions. Register now to apply.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {event.roles.map((role, index) => (
                            <div key={index} className="p-4 border rounded-lg flex items-start gap-4">
                                <Briefcase className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold">{role.title}</h3>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="text-center space-x-4">
                    <Button asChild size="lg" className="px-12 py-6 text-lg">
                        <Link href="/walkin-drive/register">
                            Register Now
                        </Link>
                    </Button>
                     <Button asChild size="lg" variant="outline" className="px-12 py-6 text-lg">
                        <Link href="/walkin-drive/login">
                           <LogIn className="mr-2 h-5 w-5"/> Already Applied? Login
                        </Link>
                    </Button>
                </div>
                 <footer className="text-center text-sm text-muted-foreground pt-8">
                    &copy; {new Date().getFullYear()} OptiTalent Inc. All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}
