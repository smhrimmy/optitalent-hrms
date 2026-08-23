export type Action = 'view' | 'create' | 'edit' | 'delete' | 'archive' | 'restore' | 'approve' | 'reject' | 'submit' | 'export' | 'import' | 'assign' | 'unassign' | 'execute' | 'manage' | 'configure' | 'run';
export type Resource = 'employee' | 'department' | 'location' | 'entity' | 'organization' | 'document' | 'asset' | 'attendance' | 'shift' | 'leave' | 'holiday' | 'payroll' | 'salary' | 'compensation' | 'expense' | 'timesheet' | 'job' | 'candidate' | 'interview' | 'offer' | 'onboarding' | 'performance' | 'goal' | 'feedback' | 'learning' | 'course' | 'certification' | 'helpdesk' | 'ticket' | 'offboarding' | 'workflow' | 'policy' | 'role' | 'permission' | 'security' | 'audit' | 'integration' | 'report' | 'notification' | 'ai';

export type Permission = `${Resource}.${Action}`;

export type Scope = 
  | 'global' 
  | 'company' 
  | 'entity'
  | 'country'
  | 'region'
  | 'location'
  | 'department'
  | 'team'
  | 'project'
  | 'assigned_locations' 
  | 'project_members' 
  | 'direct_report' 
  | 'self' 
  | 'restricted';

export interface AuthorizationRequest {
  companyId: string;
  userId: string;
  role: string;
  resource: Resource;
  action: Action;
  targetId?: string;
  targetType?: string;
  scope?: Scope;
  fields?: string[];
  context?: Record<string, any>;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason: string;
  scope: Scope;
  permittedFields?: string[];
  policyId?: string;
  auditRequired?: boolean;
}

// Map roles to their base permissions and scopes
const rolePermissions: Record<string, Record<string, Scope>> = {
  'admin': {
    'employee.view': 'company',
    'employee.create': 'company',
    'employee.edit': 'company',
    'employee.delete': 'company',
    'salary.view': 'company',
    'salary.edit': 'company',
    'payroll.view': 'company',
    'payroll.run': 'company',
    'payroll.approve': 'company',
    'security.view': 'company',
    'security.manage': 'company',
    'role.view': 'company',
    'role.manage': 'company',
    'workflow.view': 'company',
    'workflow.manage': 'company',
    'workflow.execute': 'company',
    'ai.execute': 'company',
  },
  'hr': {
    'employee.view': 'company',
    'employee.create': 'company',
    'employee.edit': 'company',
    'employee.delete': 'company',
    'salary.view': 'company',
    'salary.edit': 'restricted',
    'payroll.view': 'restricted',
    'payroll.run': 'restricted',
    'payroll.approve': 'restricted',
    'security.view': 'restricted',
    'security.manage': 'restricted',
    'role.view': 'company',
    'role.manage': 'restricted',
    'workflow.view': 'company',
    'workflow.manage': 'company',
    'workflow.execute': 'company',
    'ai.execute': 'company',
  },
  'manager': {
    'employee.view': 'direct_report',
    'employee.create': 'restricted',
    'employee.edit': 'restricted',
    'employee.delete': 'restricted',
    'salary.view': 'restricted',
    'salary.edit': 'restricted',
    'payroll.view': 'restricted',
    'payroll.run': 'restricted',
    'payroll.approve': 'restricted',
    'security.view': 'restricted',
    'security.manage': 'restricted',
    'role.view': 'restricted',
    'role.manage': 'restricted',
    'workflow.view': 'restricted',
    'workflow.manage': 'restricted',
    'workflow.execute': 'direct_report',
    'ai.execute': 'direct_report',
  },
  'employee': {
    'employee.view': 'self',
    'employee.create': 'restricted',
    'employee.edit': 'restricted',
    'employee.delete': 'restricted',
    'salary.view': 'self',
    'salary.edit': 'restricted',
    'payroll.view': 'restricted',
    'payroll.run': 'restricted',
    'payroll.approve': 'restricted',
    'security.view': 'restricted',
    'security.manage': 'restricted',
    'role.view': 'restricted',
    'role.manage': 'restricted',
    'workflow.view': 'restricted',
    'workflow.manage': 'restricted',
    'workflow.execute': 'self',
    'ai.execute': 'self',
  }
};

const fieldPermissions: Record<string, Record<string, { public: string[], restricted: string[], sensitive: string[] }>> = {
  'employee': {
    'admin': {
        public: ['name', 'avatar', 'designation', 'department'],
        restricted: ['phone', 'personal_email'],
        sensitive: ['salary', 'bank_account', 'tax_information']
    },
    'hr': {
        public: ['name', 'avatar', 'designation', 'department'],
        restricted: ['phone', 'personal_email'],
        sensitive: ['salary', 'bank_account', 'tax_information']
    },
    'manager': {
        public: ['name', 'avatar', 'designation', 'department'],
        restricted: ['phone', 'personal_email'],
        sensitive: []
    },
    'employee': {
        public: ['name', 'avatar', 'designation', 'department'],
        restricted: [],
        sensitive: [] // Can see own via 'self' scope override later
    }
  }
};

export class PermissionService {
  /**
   * Evaluates whether an authorization request is permitted.
   */
  static evaluate(request: AuthorizationRequest): AuthorizationResult {
    const permission = `${request.resource}.${request.action}`;
    const rolePolicy = rolePermissions[request.role];
    
    if (!rolePolicy) {
      return { allowed: false, reason: 'role_missing_permission', scope: 'restricted' };
    }

    const scope = rolePolicy[permission];
    if (!scope || scope === 'restricted') {
      return { allowed: false, reason: 'role_missing_permission', scope: 'restricted' };
    }

    // ABAC / Relationship checks can be enforced here using request.context
    // For example, if scope is 'self', check if resource userId === request.userId
    if (scope === 'self' && request.context) {
        if (request.context.user_id !== request.userId && request.targetId !== request.userId) {
            return { allowed: false, reason: 'abac_denied_self_scope', scope };
        }
    }
    
    if (scope === 'direct_report' && request.context) {
        if (request.context.manager_id !== request.userId) {
            return { allowed: false, reason: 'abac_denied_manager_scope', scope };
        }
    }

    // Field-level resolution
    let permittedFields: string[] | undefined = undefined;
    if (request.action === 'view' && fieldPermissions[request.resource] && fieldPermissions[request.resource][request.role]) {
        const fp = fieldPermissions[request.resource][request.role];
        permittedFields = [...fp.public, ...fp.restricted, ...fp.sensitive];
        
        // If it's their own record, allow all fields
        if (scope === 'self' || request.targetId === request.userId) {
            permittedFields = [...fp.public, ...fp.restricted, ...fp.sensitive];
        }
    }

    // Audit logging triggers
    const sensitiveActions = ['create', 'edit', 'delete', 'run', 'approve', 'manage'];
    const auditRequired = sensitiveActions.includes(request.action) || request.resource === 'security';

    return { 
        allowed: true, 
        reason: 'granted', 
        scope, 
        permittedFields,
        auditRequired 
    };
  }

  /**
   * Throws an error if the authorization request is not granted.
   */
  static enforce(request: AuthorizationRequest) {
    const result = this.evaluate(request);
    if (!result.allowed) {
      console.error(`[AUTH DENIED] resource:${request.resource} action:${request.action} reason:${result.reason}`);
      throw new Error(`Forbidden`); // Do not leak internal reasons to user
    }
    return result;
  }
}
