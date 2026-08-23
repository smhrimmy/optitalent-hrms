import { describe, it, expect } from 'vitest';
import { recruitmentService } from '../../src/lib/recruitment/service';

describe('Recruitment Security Boundary', () => {

    it('blocks a standard employee from creating a job requisition', async () => {
        const context = { tenantId: 'tenant-1', userId: 'user-1', roles: ['Employee'] }; // Not Recruiter or Admin

        await expect(recruitmentService.createRequisition(context, {
            id: 'req-2', title: 'Eng', department: 'Tech', location: 'Rem', type: 'FULL_TIME',
            status: 'OPEN', requiredSkills: [], preferredSkills: [], minExperienceYears: 1, headcountTarget: 1, headcountFilled: 0
        })).rejects.toThrow();
    });
});
