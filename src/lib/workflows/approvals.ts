// Approval Engine for Workflows

export type ApproverType = 'SPECIFIC_USER' | 'ROLE' | 'MANAGER' | 'MANAGERS_MANAGER' | 'DEPARTMENT_HEAD' | 'HRBP';
export type ApprovalMode = 'ANY' | 'ALL' | 'SEQUENTIAL';

export interface ApprovalConfig {
  approvers: Array<{
    type: ApproverType;
    value?: string; // e.g. User ID if type is SPECIFIC_USER, or Role Name if type is ROLE
  }>;
  mode: ApprovalMode;
}

export class ApprovalEngine {
  
  /**
   * Resolves dynamic approvers at execution time based on context.
   */
  async resolveApprovers(config: ApprovalConfig, context: Record<string, any>): Promise<string[]> {
    const resolvedUserIds: string[] = [];

    for (const approver of config.approvers) {
      switch (approver.type) {
        case 'SPECIFIC_USER':
          if (approver.value) resolvedUserIds.push(approver.value);
          break;
        case 'MANAGER':
          // Mock resolution: in a real app, query the org chart from context.initiatorId
          resolvedUserIds.push('manager-id-mock');
          break;
        case 'MANAGERS_MANAGER':
          resolvedUserIds.push('director-id-mock');
          break;
        case 'HRBP':
          resolvedUserIds.push('hrbp-id-mock');
          break;
        case 'ROLE':
          // Would query all users with this role in this company
          resolvedUserIds.push(`role-${approver.value}-mock`);
          break;
      }
    }

    // Deduplicate
    return [...new Set(resolvedUserIds)];
  }

  /**
   * Evaluates if an approval is fully met based on its mode and received responses
   */
  isApprovalComplete(mode: ApprovalMode, requiredUserIds: string[], approvedUserIds: string[]): boolean {
    if (requiredUserIds.length === 0) return true;

    switch (mode) {
      case 'ANY':
        return requiredUserIds.some(id => approvedUserIds.includes(id));
      case 'ALL':
      case 'SEQUENTIAL':
        return requiredUserIds.every(id => approvedUserIds.includes(id));
      default:
        return false;
    }
  }
}

export const approvalEngine = new ApprovalEngine();
