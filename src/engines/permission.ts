import { canAct, fieldAccess, mapLegacyRole, type FieldId, type GeneratedConfig } from '@/lib/company-blueprint';

export type Principal = {
  role: string;
  location?: string;
  department?: string;
  region?: string;
};

export type AccessRequest = {
  module: string;
  action: string;
  field?: FieldId;
  subject?: { location?: string; department?: string };
};

/** RBAC + ABAC + field ACL. Screens and AI tools must call this — never `if (role === 'HR')`. */
export function authorize(dna: GeneratedConfig | undefined, principal: Principal, req: AccessRequest): { ok: boolean; reason: string } {
  const roleId = mapLegacyRole(principal.role);
  const actor = {
    roleId,
    location: principal.location,
    department: principal.department,
    region: principal.region,
  };

  if (req.field) {
    const access = fieldAccess(dna, actor, req.field);
    if (access === 'hidden') return { ok: false, reason: `${req.field} is hidden for this role/scope` };
    if (req.action === 'edit' && access !== 'edit') return { ok: false, reason: `${req.field} is view-only` };
    if (req.action === 'view' && access === 'hidden') return { ok: false, reason: `${req.field} is hidden` };
  }

  const ok = canAct(dna, actor, req.module, req.action, req.subject);
  return ok
    ? { ok: true, reason: 'granted' }
    : { ok: false, reason: `${req.module}.${req.action} denied for role ${roleId} in this scope` };
}
