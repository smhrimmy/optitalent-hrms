'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeNotification } from '@/lib/employee/domain';
import { NotificationCard } from '@/components/employee/NotificationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, CheckCircle2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeNotificationsOS() {
    const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getNotifications('emp-1');
            // Sort by newest first
            setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleMarkRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-48 mb-8" />
                <div className="space-y-4">
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;
    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return n.status === 'UNREAD';
        if (activeTab === 'action') return n.category === 'ACTION_REQUIRED' || n.priority === 'HIGH' || n.priority === 'URGENT';
        return true;
    });

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-sm py-0.5 px-2.5 rounded-full font-medium">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Updates, approvals, and actions requiring your attention.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Mark all read
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Notification Preferences">
                        <Link href="/employee/notifications/preferences">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 w-full justify-start h-12 p-1 bg-muted/50 overflow-x-auto hide-scrollbar">
                    <TabsTrigger value="all" className="flex-1 sm:flex-none min-w-[100px] data-[state=active]:shadow-sm">
                        All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1 sm:flex-none min-w-[100px] data-[state=active]:shadow-sm gap-2">
                        Unread {unreadCount > 0 && <span className="bg-primary/10 text-primary px-1.5 rounded text-xs">{unreadCount}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="action" className="flex-1 sm:flex-none min-w-[140px] data-[state=active]:shadow-sm gap-2">
                        Action Required
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 m-0 focus-visible:outline-none focus-visible:ring-0">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <NotificationCard 
                                key={notification.id} 
                                notification={notification} 
                                onMarkRead={handleMarkRead}
                            />
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/10">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Bell className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">You're all caught up!</h3>
                            <p className="text-muted-foreground mt-1 max-w-sm">
                                {activeTab === 'unread' 
                                    ? "You have no unread notifications at the moment."
                                    : "You don't have any notifications that require action."}
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
