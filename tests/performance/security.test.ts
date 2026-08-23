import { describe, it, expect } from 'vitest';
import { performanceService } from '../../src/lib/performance/service';

describe('Performance Security Boundary', () => {

    it('blocks an employee from updating another employees goal', async () => {
        const maliciousContext = { tenantId: 'tenant-1', userId: 'malicious-emp', roles: ['Employee'] };

        await expect(performanceService.createGoal(maliciousContext, {
            id: 'g-3', employeeId: 'target-emp', title: 'Target Goal', description: '', period: 'Q1',
            progress: 0, status: 'ACTIVE', linkedSkills: [], keyResults: []
        })).rejects.toThrow();
    });
});
