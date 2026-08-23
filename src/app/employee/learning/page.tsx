'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeCourse } from '@/lib/employee/domain';
import { CourseCard } from '@/components/employee/CourseCard';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EmployeeLearningOS() {
    const [courses, setCourses] = useState<EmployeeCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getCourses('emp-1');
            setCourses(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
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

    const requiredTraining = courses.filter(c => c.isRequired);
    const recommendedCourses = courses.filter(c => !c.isRequired);
    const completedCourses = courses.filter(c => c.status === 'COMPLETED' || c.status === 'PASSED').length;
    
    // Simulate role readiness from Career Target
    const roleReadiness = 72;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Learning & Development</h1>
                    <p className="text-muted-foreground mt-1">
                        Acquire new skills, complete required training, and prepare for your next role.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/employee/learning/history">Learning History</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/employee/learning/certificates">Certificates</Link>
                    </Button>
                </div>
            </div>

            {/* Learning Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Courses</p>
                                <h3 className="text-2xl font-bold">{completedCourses} / {courses.length} Completed</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Required Training</p>
                                <h3 className="text-2xl font-bold">{requiredTraining.filter(c => c.status !== 'COMPLETED' && c.status !== 'PASSED').length} Pending</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-700">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-sm font-medium text-green-900">Career Readiness</p>
                                    <span className="font-bold text-green-700">{roleReadiness}%</span>
                                </div>
                                <Progress value={roleReadiness} className="h-2 [&>div]:bg-green-500 bg-green-200" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Required Training Section */}
            {requiredTraining.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" /> Required Training
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requiredTraining.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Learning Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" /> Recommended For You
                    </h2>
                    <Button variant="ghost" className="gap-2 text-primary">
                        Browse Catalog <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground max-w-3xl">
                    These courses have been recommended by the AI Learning Engine to close your verified skill gaps and improve your readiness for your target role.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
