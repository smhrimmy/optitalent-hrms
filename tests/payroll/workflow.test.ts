import { describe, it, expect } from 'vitest';
import { payrollService } from '../../src/lib/payroll/service';

describe('Payroll Workflow Engine', () => {

    it('transitions from CALCULATED to FINALIZED and prevents re-finalization', async () => {
        const context = { tenantId: 'test-tenant', userId: 'admin', roles: ['PayrollAdmin'] };
        
        const run = await payrollService.calculateRun(context, 'run-1', [], [], 'IN');
        expect(run.status).toBe('CALCULATED');

        const finalizedRun = await payrollService.finalizeRun(context, 'run-1');
        expect(finalizedRun.status).toBe('FINALIZED');

        await expect(payrollService.finalizeRun(context, 'run-1')).rejects.toThrow('already finalized');
    });
});
