export interface DemandForecast {
    id: string;
    companyId: string;
    period: string; // e.g., '2027-Q1'
    department: string;
    targetHeadcount: number;
    requiredRoles: { roleId: string; count: number }[];
    requiredSkills: { skillId: string; count: number; proficiencyLevel: number }[];
}

export interface GapAnalysis {
    id: string;
    forecastId: string;
    timestamp: Date;
    
    headcountGap: number; // positive means we need more people
    roleGaps: { roleId: string; current: number; required: number; gap: number }[];
    skillGaps: { skillId: string; current: number; required: number; gap: number }[];
    
    internalMobilityCandidates: { employeeId: string; roleId: string; skillMatchScore: number }[];
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    forecastId: string;
    
    interventions: Intervention[];
}

export type InterventionType = 'HIRE' | 'DEVELOP' | 'REDEPLOY';

export interface Intervention {
    type: InterventionType;
    roleId?: string;
    skillId?: string;
    count: number;
    estimatedCostPerUnit?: number; // Benchmarked cost if known
    estimatedTimeToReadinessDays?: number;
}

export interface CostSimulation {
    scenarioId: string;
    
    totalRecruitmentCost: number;
    totalLearningCost: number;
    totalPayrollIncrease: number; // Salary + Benefits
    
    totalProjectedCost: number;
    timeToReadinessAvgDays: number;
    
    confidenceScore: number; // 0-100 based on historical predictability
    assumptions: string[];
}

export interface ScenarioComparison {
    forecastId: string;
    scenarios: {
        scenario: Scenario;
        simulation: CostSimulation;
    }[];
    recommendedScenarioId?: string;
}

export interface WorkforcePlan {
    id: string;
    companyId: string;
    forecastId: string;
    approvedScenarioId: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_EXECUTION' | 'COMPLETED';
    approvedAt?: Date;
    approvedBy?: string;
}
