import { describe, it, expect, vi } from 'vitest';
import { lifecycleService } from '../../src/lib/lifecycle/service';
import { eventRegistry } from '../../src/lib/events/registry';

describe('Lifecycle Event Workflow', () => {

    it('executes a transition and publishes a domain event', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        const context = { tenantId: 'tenant-1', userId: 'mgr-1', roles: ['Manager'] };

        // For test setup, inject current state as ACTIVE in the mock
        (lifecycleService as any).employeeStates.set('emp-1', 'ACTIVE');

        const event = await lifecycleService.executeTransition(
            context,
            'emp-1',
            'PROMOTION_PENDING',
            'PROMOTION',
            'Promoted to Lead',
            '2026-09-01',
            ['PAYROLL', 'BENEFITS'],
            []
        );

        expect(event.type).toBe('PROMOTION');
        
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'lifecycle.promotion',
            payload: expect.objectContaining({ 
                targetState: 'PROMOTION_PENDING',
                effectiveDate: '2026-09-01'
            })
        }));

        const timeline = lifecycleService.getTimeline('emp-1');
        expect(timeline).toHaveLength(1);
    });
});
