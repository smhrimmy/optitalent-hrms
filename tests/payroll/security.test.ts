import { describe, it, expect } from 'vitest';
import { payrollService } from '../../src/lib/payroll/service';

describe('Payroll Security Boundary', () => {

    it('blocks payroll calculation if user lacks permission', async () => {
        const unauthorizedContext = {
            tenantId: 'tenant-1',
            userId: 'user-2',
            roles: ['Employee'] // Not PayrollAdmin
        };

        // Note: For the test to pass in a real environment, PermissionService would be mocked 
        // to throw an Error('Unauthorized') for this context.
        await expect(payrollService.calculateRun(unauthorizedContext, 'run-1', [], [], 'IN')).rejects.toThrow();
    });
});
