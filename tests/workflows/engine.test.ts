import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workflowEngine } from '../../src/lib/workflows/engine';
import { workflowRepository } from '../../src/lib/workflows/repository';
import { Workflow, WorkflowVersion } from '../../src/lib/workflows/types';
import * as authServer from '../../src/lib/auth-server';
import { PermissionService } from '../../src/lib/permissions';
import { actionRegistry } from '../../src/lib/workflows/actions/registry';

describe('Workflow Engine', () => {
    
    beforeEach(() => {
        vi.resetAllMocks();
        
        // Mock server context
        vi.spyOn(authServer, 'getServerContext').mockResolvedValue({
            tenantId: 'tenant-1',
            userId: 'user-1',
            role: 'admin'
        });

        // Mock permission check to pass by default
        vi.spyOn(PermissionService, 'enforce').mockImplementation(() => true);
    });

    it('successfully traverses a conditional workflow', async () => {
        const workflowId = 'wf-leave-1';
        
        // 1. Setup mock workflow definition
        const version: WorkflowVersion = {
            id: 'v1',
            workflowId,
            versionNumber: 1,
            triggerId: 'leave.submitted',
            isActive: true,
            createdAt: new Date().toISOString(),
            nodes: [
                { id: 'node-trigger', type: 'trigger', name: 'Leave Submitted', config: { triggerId: 'leave.submitted' } },
                { id: 'node-cond', type: 'condition', name: 'Check Duration', config: { 
                    ast: { operator: '>', left: { field: 'leave.duration' }, right: 7 }
                }},
                { id: 'node-hr', type: 'approval', name: 'HR Approval', config: {} },
                { id: 'node-manager', type: 'approval', name: 'Manager Approval', config: {} },
                { id: 'node-update', type: 'action', name: 'Update Balance', config: { actionId: 'leave.update_balance' } }
            ],
            edges: [
                { id: 'e1', sourceNodeId: 'node-trigger', targetNodeId: 'node-cond' },
                // Edge if condition matches (duration > 7)
                { id: 'e2', sourceNodeId: 'node-cond', targetNodeId: 'node-hr', conditionId: 'node-cond' },
                // Fallback edge (duration <= 7)
                { id: 'e3', sourceNodeId: 'node-cond', targetNodeId: 'node-manager' },
            ]
        };

        vi.spyOn(workflowRepository, 'getActiveVersion').mockResolvedValue(version);
        
        // Mock the action to avoid real execution
        vi.spyOn(actionRegistry, 'getAction').mockReturnValue({
            id: 'leave.update_balance',
            name: 'Mock',
            description: 'Mock',
            execute: vi.fn().mockResolvedValue({ balanceUpdated: true })
        });

        // Mock repository methods
        let currentExecution: any;
        vi.spyOn(workflowRepository, 'createExecution').mockImplementation(async (exec) => { currentExecution = exec; });
        vi.spyOn(workflowRepository, 'getExecution').mockImplementation(async () => currentExecution);
        vi.spyOn(workflowRepository, 'updateExecution').mockImplementation(async (exec) => { currentExecution = exec; });
        vi.spyOn(workflowRepository, 'logExecutionStep').mockResolvedValue();

        // 2. Start Execution for leave duration = 10 (should route to HR)
        const execution = await workflowEngine.startExecution(workflowId, 'leave.submitted', {
            leave: { duration: 10 }
        });

        // 3. Wait for async state machine to process until it hits the approval (WAITING)
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        expect(currentExecution.status).toBe('WAITING');
        expect(currentExecution.currentNodeId).toBe('node-hr'); // Traversed the > 7 condition
    });
});
