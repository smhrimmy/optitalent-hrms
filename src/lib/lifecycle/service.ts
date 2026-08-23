import { EmployeeState, LifecycleEvent, EffectiveRecord } from './types';
import { lifecycleEngine } from './engine';
import { eventRegistry } from '../events/registry';
import crypto from 'crypto';

export class LifecycleService {
    
    // In-memory mock of an employee's state and timeline
    private employeeStates: Map<string, EmployeeState> = new Map();
    private timelines: Map<string, LifecycleEvent[]> = new Map();

    async executeTransition(
        context: any,
        employeeId: string,
        targetState: EmployeeState,
        eventType: string,
        description: string,
        effectiveDate: string,
        affectedModules: LifecycleEvent['affectedModules'],
        resultingChanges: EffectiveRecord[]
    ): Promise<LifecycleEvent> {
        
        const currentState = this.employeeStates.get(employeeId) || 'ACTIVE'; // Default for testing

        if (!lifecycleEngine.canTransition(currentState, targetState)) {
            throw new Error(`Invalid lifecycle transition from ${currentState} to ${targetState}`);
        }

        // Update state
        this.employeeStates.set(employeeId, targetState);

        // Record the event in the timeline
        const event: LifecycleEvent = {
            id: crypto.randomUUID(),
            employeeId,
            type: eventType,
            description,
            initiatorId: context.userId,
            effectiveDate,
            recordedAt: new Date().toISOString(),
            affectedModules,
            auditRecordId: crypto.randomUUID(),
            resultingChanges
        };

        const timeline = this.timelines.get(employeeId) || [];
        timeline.push(event);
        this.timelines.set(employeeId, timeline);

        // Publish to domain event bus for cross-module integration
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId || 'company-1',
            type: `lifecycle.${eventType.toLowerCase()}`, // e.g., 'lifecycle.promotion'
            actorId: context.userId,
            entityType: 'Employee',
            entityId: employeeId,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                targetState,
                effectiveDate,
                changes: resultingChanges
            }
        });

        return event;
    }

    getTimeline(employeeId: string): LifecycleEvent[] {
        return this.timelines.get(employeeId) || [];
    }
}

export const lifecycleService = new LifecycleService();
