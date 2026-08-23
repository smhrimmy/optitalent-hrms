export interface KeyResult {
    id: string;
    title: string;
    targetValue: number;
    currentValue: number;
    unit: string; // e.g., '%', '$', 'features'
    status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | 'COMPLETED';
}

export interface Goal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    period: string; // e.g., 'Q3 2026'
    keyResults: KeyResult[];
    progress: number; // 0 to 100
    status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    linkedSkills: string[]; // Skills this goal demonstrates (e.g., ['System Architecture', 'Node.js'])
}

export interface Feedback {
    id: string;
    targetEmployeeId: string;
    providerEmployeeId: string;
    type: 'PEER' | 'MANAGER' | 'DIRECT_REPORT';
    content: string;
    submittedAt: string;
    visibility: 'PUBLIC' | 'MANAGER_ONLY' | 'PRIVATE';
}

export interface SkillEvidence {
    skill: string;
    source: 'GOAL_COMPLETION' | 'PEER_FEEDBACK' | 'MANAGER_REVIEW' | 'ATS_SCREENING';
    description: string;
    date: string;
}

export interface ReviewSummary {
    employeeId: string;
    period: string;
    overallRecommendation: string;
    keyAchievements: string[]; // Pulled from completed goals
    skillGrowth: SkillEvidence[]; // Pulled from Digital Twin updates during period
    constructiveFeedback: string[]; // Synthesized from peer reviews
    aiConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    managerId: string;
    period: string;
    status: 'DRAFT' | 'SHARED_WITH_EMPLOYEE' | 'ACKNOWLEDGED' | 'FINALIZED';
    aiSummary?: ReviewSummary;
    managerComments: string;
    employeeComments?: string;
    finalRating?: 'EXCEEDS' | 'MEETS' | 'NEEDS_IMPROVEMENT'; // Kept as optional if traditional scale is needed alongside OKRs
}
