export type EmployeeState = 
    | 'APPLICANT' 
    | 'OFFERED' 
    | 'PREBOARDING' 
    | 'ONBOARDING' 
    | 'PROBATION' 
    | 'ACTIVE' 
    | 'ON_LEAVE' 
    | 'SUSPENDED' 
    | 'TRANSFER_PENDING' 
    | 'PROMOTION_PENDING' 
    | 'EXIT_PENDING' 
    | 'NOTICE_PERIOD' 
    | 'OFFBOARDING' 
    | 'TERMINATED' 
    | 'RETIRED' 
    | 'ALUMNI';

export interface EffectiveRecord {
    id: string;
    employeeId: string;
    field: string;
    oldValue: any;
    newValue: any;
    effectiveDate: string; // ISO 8601
    recordedAt: string;
}

export interface LifecycleEvent {
    id: string;
    employeeId: string;
    type: string; // e.g., 'PROMOTION', 'PERFORMANCE_REVIEW', 'SKILL_EVIDENCE'
    description: string;
    initiatorId: string;
    approverId?: string;
    effectiveDate: string;
    recordedAt: string;
    affectedModules: ('PAYROLL' | 'BENEFITS' | 'LEARNING' | 'ATTENDANCE' | 'PERFORMANCE')[];
    workflowId?: string;
    auditRecordId: string;
    resultingChanges: EffectiveRecord[];
}

export interface ImpactPreview {
    transitionType: string;
    employeeId: string;
    effectiveDate: string;
    impacts: {
        module: 'COMPENSATION' | 'BENEFITS' | 'LEARNING' | 'PAYROLL' | 'ATTENDANCE' | 'MANAGER' | 'PERMISSIONS';
        changeSummary: string;
        type: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    }[];
    estimatedMonthlyPayrollImpact: number;
}
