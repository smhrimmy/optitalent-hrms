import { triggerEngine } from '../workflows/triggers';
import { getCompanyContext, buildAuthRequest } from '../auth-server';
import { PermissionService } from '../permissions';

export class ExpenseService {
    
    /**
     * Submits an expense request.
     * Integrates with Workflow engine for policy validation and dynamic approval routing.
     */
    async submitExpense(employeeId: string, amount: number, currency: string, category: string, description: string): Promise<void> {
        const context = await getCompanyContext();
        if (!context) throw new Error('Unauthorized');

        // 1. Initial Authorization Boundary
        const authReq = buildAuthRequest(context, 'expense', 'create', employeeId);
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');;

        // 2. Draft the expense record (Pending state)
        const expenseRecord = {
            id: crypto.randomUUID(),
            employeeId,
            amount,
            currency,
            category,
            description,
            status: 'PENDING'
        };

        // 3. Fire the Workflow Trigger
        await triggerEngine.fire({
            eventType: 'expense.submitted',
            companyId: context.companyId,
            initiatingUserId: context.userId,
            payload: { expense: expenseRecord }
        });

        // 4. Publish Domain Event for the Digital Twin
        const { eventRegistry } = await import('../events/registry');
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId,
            type: 'expense.submitted',
            actorId: context.userId,
            entityType: 'Expense',
            entityId: expenseRecord.id,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: { amount, currency, category }
        });
    }
}

export const expenseService = new ExpenseService();
