import { describe, it, expect } from 'vitest';
import { benefitsService } from '../../src/lib/benefits/service';
import { BenefitPlan } from '../../src/lib/benefits/types';

describe('Benefits Security Boundary', () => {

    it('blocks an employee from approving their own enrollment', async () => {
        const empContext = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };

        const plan: BenefitPlan = {
            id: 'b-1', tenantId: 'tenant-1', name: 'Standard Health', category: 'HEALTH',
            provider: 'GlobalHealth', employerContributionAmount: 500, employeeContributionAmount: 100,
            taxTreatment: 'PRE_TAX', status: 'ACTIVE', eligibilityRules: []
        };

        const enrollment = await benefitsService.enroll(empContext, 'emp-1', plan);
        
        // Employee tries to approve their own enrollment
        await expect(benefitsService.approveEnrollment(empContext, enrollment.id))
            .rejects.toThrow('Access denied');
    });
});
