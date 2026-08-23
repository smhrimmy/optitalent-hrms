import { PermissionService } from '../../permissions';
import { buildAuthRequest } from '../../auth-server';

export interface WorkflowAction {
  id: string;
  name: string;
  description: string;
  execute: (context: Record<string, any>, authContext: { companyId: string, userId: string, role: string }) => Promise<Record<string, any>>;
}

class ActionRegistry {
  private actions: Map<string, WorkflowAction> = new Map();

  register(action: WorkflowAction) {
    this.actions.set(action.id, action);
  }

  getAction(id: string): WorkflowAction | undefined {
    return this.actions.get(id);
  }
}

export const actionRegistry = new ActionRegistry();

// Example Registered Actions

actionRegistry.register({
  id: 'employee.update',
  name: 'Update Employee',
  description: 'Updates an employee record',
  execute: async (context, authContext) => {
    const targetId = context.employeeId;
    
    // 1. Authorize action
    const authReq = buildAuthRequest(authContext, 'employee', 'update', targetId, context);
    const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');;

    // 2. Perform action
    console.log(`Executing employee.update for ${targetId}`);
    return { updated: true, targetId };
  }
});

actionRegistry.register({
  id: 'notification.send',
  name: 'Send Notification',
  description: 'Sends a notification',
  execute: async (context, authContext) => {
    // 1. Authorize action
    const authReq = buildAuthRequest(authContext, 'notification' as any, 'create', context.targetUserId, context);
    const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');;

    // 2. Perform action
    console.log(`Sending notification to ${context.targetUserId}: ${context.message}`);
    return { notified: true };
  }
});
