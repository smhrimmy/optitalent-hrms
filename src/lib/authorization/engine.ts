import { CompanyContext } from "../auth-server";

export interface AuthorizeRequest {
  context: CompanyContext | null; // Passed from getCompanyContext()
  resource: string;
  action: string;
  target?: string;
  scope?: string;
  fields?: string[];
}

export interface AuthorizeResult {
  allowed: boolean;
  reason: string;
  matchedRoles: string[];
  matchedPermissions: any[];
  scope: string;
  deniedFields: string[];
}

/**
 * Canonical Authorization Engine
 * Validates access based on the rich CompanyContext.
 */
export function authorize(req: AuthorizeRequest): AuthorizeResult {
  const { context, resource, action, fields } = req;

  if (!context) {
    return {
      allowed: false,
      reason: 'No active company context',
      matchedRoles: [],
      matchedPermissions: [],
      scope: 'none',
      deniedFields: fields || []
    };
  }

  if (context.platformRole === 'platform_owner') {
    return {
      allowed: true,
      reason: 'Platform Owner Bypass',
      matchedRoles: ['platform_owner'],
      matchedPermissions: [],
      scope: 'global',
      deniedFields: []
    };
  }

  const matchedRoles: string[] = [];
  const matchedPermissions: any[] = [];
  let isAllowed = false;
  let grantReason = 'Denied by default';

  // Evaluate permissions injected in context
  for (const perm of context.permissions as any[]) {
      const resourceMatch = perm.resource === '*' || perm.resource === resource;
      const actionMatch = perm.action === '*' || perm.action === action;

      if (resourceMatch && actionMatch) {
          isAllowed = true;
          grantReason = `Granted by permission rule on resource: ${resource}`;
          matchedPermissions.push(perm);
      }
  }

  // Field-level security evaluation (Simplified)
  // If the user requested fields, we check if the permission allows them or explicitly denies them.
  const deniedFields: string[] = [];
  if (isAllowed && fields && fields.length > 0) {
      // In a real implementation, this would cross-reference `perm.fields` array
      // For now, we allow all requested fields if the base action is allowed.
  }

  if (!isAllowed) {
      grantReason = `User lacks permission for ${resource}.${action}`;
  }

  return {
    allowed: isAllowed,
    reason: grantReason,
    matchedRoles,
    matchedPermissions,
    scope: context.scopes[0] || 'company', // Simplification for now
    deniedFields: isAllowed ? deniedFields : (fields || [])
  };
}
