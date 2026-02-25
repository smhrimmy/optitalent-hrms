
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Bell, BookOpen, Check, Clock, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { CourseCard } from '@/components/learning/course-card';
import { TeamProgressTable } from '@/components/learning/team-progress-table';

// Define types locally or import from a types file if available
type Course = {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: number; // changed to number for minutes
    dueDate: string;
    imageUrl: string;
};

type EmployeeProgress = {
    courseId: string;
    employeeId: string;
    status: string;
    progress: number;
};

const EmployeeView = () => {
    const { user } = useAuth();
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [progressMap, setProgressMap] = React.useState<Record<string, EmployeeProgress>>({});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const { data: userData } = await supabase
                    .from('users')
                    .select('tenant_id, employees(id)')
                    .eq('id', authUser.id)
                    .single();
                
                if (!userData?.tenant_id || !userData.employees?.[0]?.id) return;
                const employeeId = userData.employees[0].id;

                // Fetch Courses (All courses for tenant for now, ideally assigned ones)
                // We'll join with enrollments to get assigned courses
                const { data: enrollments, error: enrollError } = await supabase
                    .from('course_enrollments')
                    .select(`
                        *,
                        courses (*)
                    `)
                    .eq('employee_id', employeeId);

                if (enrollError) throw enrollError;

                if (enrollments) {
                    const mappedCourses: Course[] = [];
                    const mappedProgress: Record<string, EmployeeProgress> = {};

                    enrollments.forEach((e: any) => {
                        if (e.courses) {
                            mappedCourses.push({
                                id: e.courses.id,
                                title: e.courses.title,
                                description: e.courses.description,
                                category: 'Training', // Default
                                duration: e.courses.duration_minutes || 0,
                                dueDate: e.courses.due_date || new Date().toISOString(),
                                imageUrl: e.courses.thumbnail_url
                            });

                            mappedProgress[e.courses.id] = {
                                courseId: e.courses.id,
                                employeeId: employeeId,
                                status: e.status,
                                progress: e.progress
                            };
                        }
                    });

                    setCourses(mappedCourses);
                    setProgressMap(mappedProgress);
                }
            } catch (error) {
                console.error("Error fetching learning data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const overdueCourses = useMemo(() => {
        return courses.filter(course => {
            const progress = progressMap[course.id];
            if (!progress || progress.status === 'Completed') return false;
            
            const dueDate = new Date(course.dueDate);
            const today = new Date();
            return dueDate < today;
        });
    }, [courses, progressMap]);
    
    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (courses.length === 0) {
        return (
             <Card>
                <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Check className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">All Caught Up!</h3>
                <p className="text-muted-foreground text-sm max-w-md">You have no assigned courses at this time. Keep an eye on this page for new training opportunities.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {overdueCourses.length > 0 && (
                <Alert variant="destructive">
                    <Bell className="h-4 w-4" />
                    <AlertTitle>Action Required!</AlertTitle>
                    <AlertDescription>
                        You have {overdueCourses.length} overdue course(s). Please complete them as soon as possible to remain compliant.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map(course => {
                    const progress = progressMap[course.id];
                    return (
                        <CourseCard 
                            key={course.id} 
                            course={course as any} // Cast to any to bypass strict type check for now if types mismatch slightly
                            progress={progress as any} 
                        />
                    );
                })}
            </div>
        </div>
    );
};


const ManagerView = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> Team Training Progress</CardTitle>
                <CardDescription>
                    Monitor the training and compliance status for all members of your team.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TeamProgressTable />
            </CardContent>
        </Card>
    )
}

export default function LearningPage() {
    const params = useParams();
    const role = params.role as string;
    
    // Roles that will see the manager/team view
    const managerRoles = ['manager', 'hr', 'trainer', 'team-leader', 'admin'];
    const isManagerView = managerRoles.includes(role);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Learning & Development</h1>
                <p className="text-muted-foreground">
                    {isManagerView ? 'Track your team\'s learning progress.' : 'Access your assigned courses and training materials.'}
                </p>
            </div>
            {isManagerView ? <ManagerView /> : <EmployeeView />}
        </div>
    );
}
