export type RequestStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'REJECTED'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_EMPLOYEE'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'ESCALATED'
    | 'CLOSED';

export type RequestCategory =
    | 'HR'
    | 'IT'
    | 'FINANCE'
    | 'PAYROLL'
    | 'TRAVEL'
    | 'ASSETS'
    | 'BENEFITS'
    | 'LEARNING'
    | 'ATTENDANCE'
    | 'DOCUMENTS'
    | 'OTHER';

export interface RequestType {
    id: string;
    companyId: string;
    name: string;
    description: string;
    category: RequestCategory;
    icon?: string;
    isActive: boolean;
    
    // Config
    fields: RequestFieldConfig[];
    eligibilityRules: EligibilityRule[];
    approvalWorkflow: ApprovalStepConfig[];
    
    // SLA
    targetResponseHours?: number;
    targetResolutionHours?: number;
    businessHoursOnly: boolean;
    
    // Security
    allowedRoles: string[];
    
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestFieldConfig {
    id: string;
    name: string;
    label: string;
    type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'CURRENCY' | 'EMAIL' | 'PHONE' | 'DATE' | 'SELECT' | 'FILE' | 'EMPLOYEE' | 'LOCATION';
    required: boolean;
    options?: { label: string; value: string }[]; // For SELECT
    defaultValue?: any;
    visibilityConditions?: VisibilityCondition[];
}

export interface VisibilityCondition {
    fieldId: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS';
    value: any;
}

export interface EligibilityRule {
    attribute: string; // e.g., 'employmentType', 'tenureDays'
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN';
    value: any;
    denialMessage?: string; // Explainable denial
}

export interface ApprovalStepConfig {
    stepId: string;
    type: 'MANAGER' | 'HR' | 'FINANCE' | 'ROLE' | 'SPECIFIC_USER';
    roleId?: string;
    userId?: string;
    requiredApprovers: number; // For ANY (1) vs ALL (>1)
}

export interface RequestSubmission {
    id: string;
    companyId: string;
    requestTypeId: string;
    employeeId: string;
    
    status: RequestStatus;
    
    // Submitted Data
    formData: Record<string, any>;
    
    // SLA Tracking
    submittedAt: Date;
    expectedResponseAt?: Date;
    expectedResolutionAt?: Date;
    
    // Workflow State
    currentApprovalStepId?: string;
    
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestComment {
    id: string;
    requestId: string;
    authorId: string;
    content: string;
    isInternal: boolean;
    createdAt: Date;
}

export interface RequestStatusHistory {
    id: string;
    requestId: string;
    actorId: string;
    previousStatus: RequestStatus;
    newStatus: RequestStatus;
    comment?: string;
    timestamp: Date;
}
