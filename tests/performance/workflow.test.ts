import { describe, it, expect, vi } from 'vitest';
import { performanceService } from '../../src/lib/performance/service';
import { eventRegistry } from '../../src/lib/events/registry';

describe('Performance to Digital Twin Workflow', () => {

    it('publishes skill.evidence_added when a goal is completed', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        const context = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };

        await performanceService.createGoal(context, {
            id: 'g-2', employeeId: 'emp-1', title: 'Learn React', description: '', period: 'Q1',
            progress: 0, status: 'ACTIVE', linkedSkills: ['React'],
            keyResults: [
                { id: 'kr-1', title: 'Build App', currentValue: 0, targetValue: 1, unit: 'app', status: 'ON_TRACK' }
            ]
        });

        const updatedGoal = await performanceService.updateGoalProgress(context, 'g-2', 'kr-1', 1);

        expect(updatedGoal.status).toBe('COMPLETED');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'skill.evidence_added',
            payload: expect.objectContaining({ skill: 'React', source: 'GOAL_COMPLETION' })
        }));
    });
});
