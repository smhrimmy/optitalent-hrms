'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EmployeeCourse } from '@/lib/employee/domain';
import { Clock, GraduationCap, AlertCircle, PlayCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CourseCardProps {
    course: EmployeeCourse;
}

export function CourseCard({ course }: CourseCardProps) {
    const isCompleted = course.status === 'PASSED' || course.status === 'COMPLETED';

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-tight">
                        {course.title}
                    </CardTitle>
                    {course.isRequired && (
                        <Badge variant="destructive" className="whitespace-nowrap shrink-0">
                            Required
                        </Badge>
                    )}
                    {isCompleted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-none shrink-0">
                            Completed
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        <span>{course.provider}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                {course.reason && (
                    <div className="bg-muted/50 p-3 rounded-md flex gap-2 items-start text-sm mb-4">
                        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{course.reason}</span>
                    </div>
                )}

                <div className="mt-auto space-y-4">
                    {!isCompleted && course.status !== 'NOT_ENROLLED' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-muted-foreground">Progress</span>
                                <span className="font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                        </div>
                    )}

                    {isCompleted && course.targetSkill && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-md">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Verified Skill: <strong>{course.targetSkill}</strong></span>
                        </div>
                    )}

                    <div className="pt-2">
                        {course.status === 'NOT_ENROLLED' ? (
                            <Button className="w-full gap-2">
                                Enroll Now
                            </Button>
                        ) : course.status === 'ASSESSMENT_PENDING' ? (
                            <Button className="w-full gap-2" variant="default" asChild>
                                <Link href={`/employee/learning/courses/${course.id}`}>Take Assessment</Link>
                            </Button>
                        ) : isCompleted ? (
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/employee/learning/courses/${course.id}`}>View Details</Link>
                            </Button>
                        ) : (
                            <Button className="w-full gap-2" variant="secondary" asChild>
                                <Link href={`/employee/learning/courses/${course.id}`}>
                                    <PlayCircle className="h-4 w-4" /> Resume
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
