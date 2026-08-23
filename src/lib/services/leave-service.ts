import { workflowEngine } from '../workflows/engine';
import { triggerEngine } from '../workflows/triggers';
import { getCompanyContext } from '../auth-server';
import { authorize } from '../authorization/engine';

export class LeaveService {
    
    /**
     * Submits a leave request.
     * Instead of writing directly to the database, this triggers the unified Workflow Engine.
     */
    async submitLeave(employeeId: string, type: string, startDate: string, endDate: string, durationDays: number): Promise<void> {
        const context = await getCompanyContext();
        if (!context) throw new Error('Unauthorized');

        // 1. Initial Authorization Boundary (Can I submit leave for this employee?)
        const authResult = authorize({
            context,
            resource: 'leave',
            action: 'create',
            target: employeeId
        });
        
        if (!authResult.allowed) {
            throw new Error(`Forbidden: ${authResult.reason}`);
        }

        // 2. Draft the leave request record (Pending state)
        const leaveRecord = {
            id: crypto.randomUUID(),
            employeeId,
            type,
            startDate,
            endDate,
            duration: durationDays,
            status: 'PENDING'
        };

        // 3. Fire the Workflow Trigger
        await triggerEngine.fire({
            eventType: 'leave.submitted',
            companyId: context.companyId,
            initiatingUserId: context.userId,
            payload: { leave: leaveRecord }
        });

        // 4. Publish Domain Event for the Digital Twin
        const { eventRegistry } = await import('../events/registry');
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId,
            type: 'leave.submitted',
            actorId: context.userId,
            entityType: 'LeaveRequest',
            entityId: leaveRecord.id,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: { duration: durationDays, type: type }
        });
    }
}

export const leaveService = new LeaveService();
