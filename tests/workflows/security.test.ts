import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workflowEngine } from '../../src/lib/workflows/engine';
import { workflowRepository } from '../../src/lib/workflows/repository';
import { WorkflowVersion } from '../../src/lib/workflows/types';
import * as authServer from '../../src/lib/auth-server';
import { PermissionService } from '../../src/lib/permissions';

describe('Workflow Security', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('denies workflow execution if initiating user lacks permission', async () => {
        const workflowId = 'wf-secure-1';
        
        // Mock server context with a guest role
        vi.spyOn(authServer, 'getServerContext').mockResolvedValue({
            tenantId: 'tenant-1',
            userId: 'guest-user',
            role: 'guest'
        });

        // Mock permission service to throw Forbidden
        vi.spyOn(PermissionService, 'enforce').mockImplementation(() => {
            throw new Error('Forbidden: Insufficient permissions');
        });

        vi.spyOn(workflowRepository, 'getActiveVersion').mockResolvedValue({ id: 'v1' } as WorkflowVersion);

        await expect(
            workflowEngine.startExecution(workflowId, 'trigger', {})
        ).rejects.toThrow('Forbidden: Insufficient permissions');
    });
});
