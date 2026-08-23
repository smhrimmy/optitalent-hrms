import { describe, it, expect } from 'vitest';
import { learningService } from '../../src/lib/learning/service';
import crypto from 'crypto';

describe('Learning Security Boundary', () => {

    it('blocks an employee from submitting an assessment for another employee', async () => {
        const emp1Context = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };
        const emp2Context = { tenantId: 'tenant-1', userId: 'emp-2', roles: ['Employee'] };

        // Emp1 enrolls
        const enrollment = await learningService.enroll(emp1Context, 'emp-1', 'c-1');

        // Emp2 tries to submit the assessment for Emp1's enrollment
        await expect(learningService.submitAssessment(emp2Context, enrollment.id, 'assess-1', 100, 80, 'c-1'))
            .rejects.toThrow('Access denied');
    });
});
