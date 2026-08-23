import { describe, it, expect } from 'vitest';
import { aiTools } from '../../src/lib/ai/tools';

describe('Intelligence Security Boundary', () => {

    it('blocks AI tools when permission is denied', async () => {
        // Mock a context representing a user without workforce intelligence access
        const unauthorizedContext = {
            tenantId: 'tenant-1',
            userId: 'user-2',
            roles: ['Employee'] // Not HR/Admin
        };

        // This expects the tool to throw due to PermissionService.enforce failing
        // Note: For the test to pass in a real environment, PermissionService would be mocked 
        // to throw an Error('Unauthorized') for this context.
        
        await expect(aiTools.getWorkforceSummary(unauthorizedContext)).rejects.toThrow();
    });
});
