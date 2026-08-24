import { Course, LearningEnrollment, Assessment } from './types';
import { eventRegistry } from '../events/registry';
import { PermissionService } from '../permissions';
import { buildAuthRequest } from '../auth-server';
import crypto from 'crypto';

export class LearningService {
    private courses: Map<string, Course> = new Map();
    private enrollments: Map<string, LearningEnrollment> = new Map();

    async enroll(context: any, employeeId: string, courseId: string): Promise<LearningEnrollment> {
        // Enforce RBAC
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');

        const enrollment: LearningEnrollment = {
            id: crypto.randomUUID(),
            employeeId,
            courseId,
            status: 'IN_PROGRESS',
            progressPercent: 0,
            enrolledAt: new Date().toISOString()
        };

        this.enrollments.set(enrollment.id, enrollment);

        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId || 'company-1',
            type: 'learning.enrolled',
            actorId: context.userId,
            entityType: 'Employee',
            entityId: employeeId,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: { courseId }
        });

        return enrollment;
    }

    async submitAssessment(context: any, enrollmentId: string, assessmentId: string, score: number, passingScore: number, courseId: string): Promise<void> {
        const enrollment = this.enrollments.get(enrollmentId);
        if (!enrollment) throw new Error('Enrollment not found');

        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');

        enrollment.assessmentScore = score;
        
        if (score >= passingScore) {
            enrollment.status = 'COMPLETED';
            enrollment.progressPercent = 100;
            enrollment.completedAt = new Date().toISOString();
            
            // Retrieve course skills
            const course = this.courses.get(courseId); // Note: In a real app we'd fetch this properly
            const skillsToUpdate = course ? course.skillsTargeted : [];

            // Publish verified evidence to the Digital Twin
            for (const skillReq of skillsToUpdate) {
                await eventRegistry.publish({
                    eventId: crypto.randomUUID(),
                    companyId: context.companyId || 'company-1',
                    type: 'skill.evidence_added',
                    actorId: context.userId,
                    entityType: 'Employee',
                    entityId: enrollment.employeeId,
                    timestamp: new Date().toISOString(),
                    version: 1,
                    payload: {
                        skill: skillReq.skill,
                        source: 'COURSE_ASSESSMENT',
                        sourceId: assessmentId,
                        date: new Date().toISOString(),
                        confidence: 'HIGH',
                        verificationStatus: 'VERIFIED',
                        proficiencyIncrease: score >= 90 ? 10 : 5 // Calculated increase based on assessment performance
                    }
                });
            }
        } else {
            enrollment.status = 'FAILED';
        }

        this.enrollments.set(enrollmentId, enrollment);
    }
}

export const learningService = new LearningService();
