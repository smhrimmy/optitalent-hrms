import { Goal } from './types';
import { okrEngine } from './engine';
import { eventRegistry } from '../events/registry';
import { PermissionService } from '../permissions';
import { buildAuthRequest } from '../auth-server';
import crypto from 'crypto';

export class PerformanceService {
    private goals: Map<string, Goal> = new Map();

    async createGoal(context: any, goal: Goal): Promise<Goal> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        this.goals.set(goal.id, goal);
        return goal;
    }

    async updateGoalProgress(context: any, goalId: string, krId: string, newValue: number): Promise<Goal> {
        const goal = this.goals.get(goalId);
        if (!goal) throw new Error('Goal not found');

        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');

        const kr = goal.keyResults.find(k => k.id === krId);
        if (!kr) throw new Error('KeyResult not found');

        kr.currentValue = newValue;
        
        // Recalculate
        goal.progress = okrEngine.calculateGoalProgress(goal.keyResults);
        const newStatus = okrEngine.evaluateGoalStatus(goal);

        // If it transitions to COMPLETED, fire domain event to Digital Twin
        if (newStatus === 'COMPLETED' && goal.status !== 'COMPLETED') {
            goal.status = 'COMPLETED';
            
            // Generate verified skill evidence for each linked skill
            for (const skill of goal.linkedSkills) {
                await eventRegistry.publish({
                    eventId: crypto.randomUUID(),
                    companyId: context.companyId || 'company-1',
                    type: 'skill.evidence_added',
                    actorId: context.userId,
                    entityType: 'Employee',
                    entityId: goal.employeeId,
                    timestamp: new Date().toISOString(),
                    version: 1,
                    payload: {
                        skill: skill,
                        source: 'GOAL_COMPLETION',
                        description: `Successfully completed goal: ${goal.title}`,
                        date: new Date().toISOString()
                    }
                });
            }
        } else {
            goal.status = newStatus;
        }

        this.goals.set(goal.id, goal);
        return goal;
    }
}

export const performanceService = new PerformanceService();
