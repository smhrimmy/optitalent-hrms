'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeActivityEvent } from '@/lib/employee/domain';
import { ActivityEventItem } from '@/components/employee/ActivityEventItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, History } from 'lucide-react';

export default function EmployeeActivityOS() {
    const [activityEvents, setActivityEvents] = useState<EmployeeActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getActivity('emp-1');
            
            // Sort by newest first
            const sorted = data.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
            setActivityEvents(sorted);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-48 mb-8" />
                <div className="space-y-4 relative pl-8">
                    <div className="h-24 bg-muted/30 rounded-lg animate-pulse w-full" />
                    <div className="h-24 bg-muted/30 rounded-lg animate-pulse w-full" />
                    <div className="h-24 bg-muted/30 rounded-lg animate-pulse w-full" />
                </div>
            </div>
        );
    }

    const filteredEvents = activityEvents.filter(event => {
        const matchesSearch = 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.source.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = activeCategoryFilter ? event.category === activeCategoryFilter : true;
        
        return matchesSearch && matchesCategory;
    });

    // Group by Date (Today, Yesterday, Earlier)
    const groupedEvents = filteredEvents.reduce((acc, event) => {
        const date = new Date(event.occurredAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let groupKey = 'Earlier';
        if (date.toDateString() === today.toDateString()) {
            groupKey = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            groupKey = 'Yesterday';
        } else {
            // e.g., '12 Aug 2026'
            groupKey = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }

        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(event);
        return acc;
    }, {} as Record<string, EmployeeActivityEvent[]>);

    const categories = Array.from(new Set(activityEvents.map(e => e.category)));

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
                    <p className="text-muted-foreground mt-1">
                        A chronological timeline of your verified professional events and milestones.
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <History className="h-4 w-4" /> Export History
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 p-4 rounded-xl border">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search activity..." 
                        className="pl-9 w-full bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0">
                    <Button 
                        variant={activeCategoryFilter === null ? "default" : "outline"} 
                        size="sm" 
                        className="shrink-0"
                        onClick={() => setActiveCategoryFilter(null)}
                    >
                        All
                    </Button>
                    {categories.map(cat => (
                        <Button 
                            key={cat}
                            variant={activeCategoryFilter === cat ? "default" : "outline"} 
                            size="sm" 
                            className="shrink-0"
                            onClick={() => setActiveCategoryFilter(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                    <Button variant="ghost" size="sm" className="shrink-0 px-2 text-muted-foreground border border-dashed">
                        <Filter className="h-4 w-4 mr-1" /> More Filters
                    </Button>
                </div>
            </div>

            <div className="space-y-8 pb-12">
                {Object.keys(groupedEvents).length > 0 ? (
                    Object.entries(groupedEvents).map(([groupName, events]) => (
                        <div key={groupName} className="space-y-4">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1 sticky top-0 bg-background/95 py-2 z-10">
                                {groupName}
                            </h3>
                            <div className="space-y-0">
                                {events.map((event, index) => (
                                    <ActivityEventItem 
                                        key={event.id} 
                                        activity={event} 
                                        isLast={index === events.length - 1} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/10">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <History className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No activity found</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">
                            Try adjusting your search or filters to see more historical events.
                        </p>
                        {(searchQuery || activeCategoryFilter) && (
                            <Button 
                                variant="outline" 
                                className="mt-4"
                                onClick={() => { setSearchQuery(''); setActiveCategoryFilter(null); }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
