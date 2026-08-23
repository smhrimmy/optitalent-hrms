export interface EmployeeContext {
    employeeId: string;
    country: string;
    entity: string;
    location: string;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
    tenureMonths: number;
    grade: string;
    jobLevel: number;
    compensationAmount: number;
}

export interface EligibilityRule {
    field: keyof EmployeeContext;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_THAN_OR_EQUALS' | 'LESS_THAN_OR_EQUALS';
    value: any;
}

export interface BenefitPlan {
    id: string;
    companyId: string;
    name: string;
    category: 'HEALTH' | 'RETIREMENT' | 'ALLOWANCE' | 'WELLNESS' | 'CUSTOM';
    provider: string;
    eligibilityRules: EligibilityRule[];
    employerContributionAmount: number;
    employeeContributionAmount: number;
    taxTreatment: 'PRE_TAX' | 'POST_TAX' | 'TAX_EXEMPT';
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface EligibilityTraceStep {
    field: string;
    ruleDescription: string;
    employeeValue: any;
    passed: boolean;
}

export interface EligibilityTrace {
    benefitId: string;
    isEligible: boolean;
    steps: EligibilityTraceStep[];
}

export interface BenefitEnrollment {
    id: string;
    employeeId: string;
    benefitId: string;
    status: 'PENDING_APPROVAL' | 'ACTIVE' | 'DENIED' | 'TERMINATED';
    effectiveDate: string;
    dependents: string[];
    enrolledAt: string;
}

export interface TotalRewards {
    employeeId: string;
    baseCompensation: number;
    employerBenefitsValue: number;
    totalRewardsValue: number;
    breakdown: {
        category: string;
        value: number;
    }[];
}
