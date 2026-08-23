import { describe, it, expect, vi } from 'vitest';
import { benefitsService } from '../../src/lib/benefits/service';
import { eventRegistry } from '../../src/lib/events/registry';
import { BenefitPlan } from '../../src/lib/benefits/types';

describe('Benefits to Payroll Workflow', () => {

    it('publishes benefit.enrolled when an enrollment is approved', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        const empContext = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };
        const hrContext = { tenantId: 'tenant-1', userId: 'hr-1', roles: ['HR_Admin'] };

        const plan: BenefitPlan = {
            id: 'b-1', tenantId: 'tenant-1', name: 'Standard Health', category: 'HEALTH',
            provider: 'GlobalHealth', employerContributionAmount: 500, employeeContributionAmount: 100,
            taxTreatment: 'PRE_TAX', status: 'ACTIVE', eligibilityRules: []
        };

        const enrollment = await benefitsService.enroll(empContext, 'emp-1', plan);
        expect(enrollment.status).toBe('PENDING_APPROVAL');

        await benefitsService.approveEnrollment(hrContext, enrollment.id);
        
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'benefit.enrolled',
            payload: expect.objectContaining({ 
                benefitId: 'b-1',
                enrollmentId: enrollment.id
            })
        }));
    });
});
