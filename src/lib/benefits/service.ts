import { BenefitEnrollment, BenefitPlan } from './types';
import { eventRegistry } from '../events/registry';
import { PermissionService } from '../permissions';
import { buildAuthRequest } from '../auth-server';
import crypto from 'crypto';

export class BenefitsService {
    private enrollments: Map<string, BenefitEnrollment> = new Map();

    async enroll(context: any, employeeId: string, plan: BenefitPlan, dependents: string[] = []): Promise<BenefitEnrollment> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden'););

        const enrollment: BenefitEnrollment = {
            id: crypto.randomUUID(),
            employeeId,
            benefitId: plan.id,
            status: 'PENDING_APPROVAL',
            effectiveDate: new Date().toISOString(), // Simplified for now
            dependents,
            enrolledAt: new Date().toISOString()
        };

        this.enrollments.set(enrollment.id, enrollment);

        return enrollment;
    }

    async approveEnrollment(context: any, enrollmentId: string): Promise<void> {
        const enrollment = this.enrollments.get(enrollmentId);
        if (!enrollment) throw new Error('Enrollment not found');

        // Note: HR/Manager approval enforces permission on the employee's record
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden'););

        enrollment.status = 'ACTIVE';
        this.enrollments.set(enrollmentId, enrollment);

        // Publish to payroll engine
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId || 'company-1',
            type: 'benefit.enrolled',
            actorId: context.userId,
            entityType: 'Employee',
            entityId: enrollment.employeeId,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                enrollmentId: enrollment.id,
                benefitId: enrollment.benefitId
                // The payroll system will listen to this event to begin processing deductions or allowances
            }
        });
    }
}

export const benefitsService = new BenefitsService();
