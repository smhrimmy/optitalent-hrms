import { describe, it, expect } from 'vitest';
import { okrEngine } from '../../src/lib/performance/engine';
import { Goal } from '../../src/lib/performance/types';

describe('OKR Calculation Engine', () => {

    it('calculates goal progress correctly based on multiple KRs', () => {
        const goal: Goal = {
            id: 'g-1', employeeId: 'emp-1', title: 'Test Goal', description: '', period: 'Q1', progress: 0, status: 'ACTIVE', linkedSkills: [],
            keyResults: [
                { id: 'kr-1', title: 'KR1', currentValue: 5, targetValue: 10, unit: 'features', status: 'ON_TRACK' }, // 50%
                { id: 'kr-2', title: 'KR2', currentValue: 10, targetValue: 10, unit: 'features', status: 'COMPLETED' } // 100%
            ]
        };

        const progress = okrEngine.calculateGoalProgress(goal.keyResults);
        expect(progress).toBe(75);
    });

    it('evaluates status to COMPLETED if progress is 100', () => {
        const goal: Goal = {
            id: 'g-1', employeeId: 'emp-1', title: 'Test Goal', description: '', period: 'Q1', progress: 0, status: 'ACTIVE', linkedSkills: [],
            keyResults: [
                { id: 'kr-1', title: 'KR1', currentValue: 10, targetValue: 10, unit: 'features', status: 'COMPLETED' } // 100%
            ]
        };

        const status = okrEngine.evaluateGoalStatus(goal);
        expect(status).toBe('COMPLETED');
    });
});
