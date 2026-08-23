import { Goal, KeyResult } from './types';

export class OKREngine {
    
    /**
     * Calculates the overall progress of a Goal based on its Key Results.
     */
    calculateGoalProgress(keyResults: KeyResult[]): number {
        if (!keyResults || keyResults.length === 0) return 0;

        let totalProgress = 0;
        keyResults.forEach(kr => {
            const krProgress = Math.min(100, Math.max(0, (kr.currentValue / kr.targetValue) * 100));
            totalProgress += krProgress;
        });

        return Math.round(totalProgress / keyResults.length);
    }

    /**
     * Determines if a goal should automatically be marked as COMPLETED based on its Key Results.
     */
    evaluateGoalStatus(goal: Goal): Goal['status'] {
        const progress = this.calculateGoalProgress(goal.keyResults);
        if (progress >= 100) {
            return 'COMPLETED';
        }
        return goal.status === 'COMPLETED' ? 'ACTIVE' : goal.status;
    }
}

export const okrEngine = new OKREngine();
