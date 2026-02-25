
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTeam } from '@/hooks/use-team';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '../ui/button';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

type Course = {
    id: string;
    title: string;
};

type Enrollment = {
    employee_id: string; // UUID
    status: string;
    progress: number;
    course_id: string;
};

export const TeamProgressTable = () => {
    const team = useTeam();
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                
                const { data: userData } = await supabase.from('users').select('tenant_id').eq('id', user.id).single();
                if (!userData?.tenant_id) return;

                const { data, error } = await supabase.from('courses').select('id, title').eq('tenant_id', userData.tenant_id);
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    setCourses(data);
                    setSelectedCourseId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;

        const fetchEnrollments = async () => {
            try {
                const { data, error } = await supabase
                    .from('course_enrollments')
                    .select('employee_id, status, progress, course_id')
                    .eq('course_id', selectedCourseId);
                
                if (error) throw error;
                if (data) {
                    setEnrollments(data);
                }
            } catch (error) {
                 console.error("Error fetching enrollments:", error);
            }
        }
        fetchEnrollments();
    }, [selectedCourseId]);

    const teamProgress = useMemo(() => {
        return team.map(member => {
            const enrollment = enrollments.find(e => e.employee_id === member.id); // member.id is UUID from useTeam
            return {
                ...member,
                status: enrollment?.status || 'Not Started',
                progress: enrollment?.progress || 0,
            };
        });
    }, [team, enrollments]);

    const handleSendReminder = (employeeName: string) => {
        toast({
            title: "Reminder Sent!",
            description: `A reminder notification has been sent to ${employeeName}.`
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case 'In Progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
            default: return <Badge variant="secondary">Not Started</Badge>;
        }
    };

    if (loading && courses.length === 0) return <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6" /></div>;
    
    if (courses.length === 0) return <div className="text-center p-4 text-muted-foreground">No courses available. Create a course to track progress.</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Select a course to view progress" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map(course => (
                             <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[200px]">Progress</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teamProgress.map(member => (
                        <TableRow key={member.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person avatar" />
                                        <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(member.status)}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={member.progress} className="h-2" />
                                    <span className="text-xs font-medium">{member.progress}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {member.status !== 'Completed' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleSendReminder(member.name)}>
                                        <Send className="mr-2 h-4 w-4" /> Send Reminder
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
