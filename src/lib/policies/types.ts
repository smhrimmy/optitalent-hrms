// Policy Engine Domain Models

export type PolicyScope = 'GLOBAL' | 'TENANT' | 'LEGAL_ENTITY' | 'COUNTRY' | 'STATE' | 'LOCATION' | 'DEPARTMENT' | 'JOB_FAMILY' | 'EMPLOYMENT_TYPE' | 'EMPLOYEE';

export type PolicyStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Policy {
  id: string;
  companyId: string;
  name: string;
  description: string;
  resource: string; // e.g. 'leave', 'attendance', 'expense'
  scope: PolicyScope;
  scopeValue?: string; // e.g. 'India' if scope is COUNTRY, or 'Engineering' if DEPARTMENT
  priority: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  status: PolicyStatus;
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRule {
  id: string;
  conditionId?: string; // AST reference
  result: Record<string, any>; // The outcome if condition matches, e.g. { days: 18, rollover: false }
}

export interface PolicyContext {
  companyId: string;
  employee: Record<string, any>; // The employee attributes (country, department, etc)
  date: string; // The evaluation date
}

export interface PolicyEvaluationResult {
  appliedPolicy: Policy | null;
  result: Record<string, any> | null;
  overriddenPolicies: Policy[];
  reason: string;
}
