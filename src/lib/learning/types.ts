export interface SkillRequirement {
    skill: string;
    targetProficiency: number; // 0-100
}

export interface Course {
    id: string;
    companyId: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    durationHours: number;
    provider: string;
    skillsTargeted: SkillRequirement[]; // Skills this course aims to develop
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: string;
}

export interface Assessment {
    id: string;
    courseId: string;
    passingScore: number;
    questionsCount: number;
}

export interface SkillEvidence {
    id: string;
    employeeId: string;
    skill: string;
    source: 'COURSE_ASSESSMENT' | 'PROJECT' | 'GOAL_COMPLETION' | 'MANAGER_VERIFIED' | 'EXTERNAL_CERTIFICATION';
    sourceId: string;
    date: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    verificationStatus: 'VERIFIED' | 'SELF_REPORTED' | 'PENDING';
    proficiencyIncrease?: number; // Estimated delta
}

export interface LearningEnrollment {
    id: string;
    employeeId: string;
    courseId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'OVERDUE';
    progressPercent: number;
    assessmentScore?: number;
    enrolledAt: string;
    completedAt?: string;
}

export interface RoleReadiness {
    employeeId: string;
    targetRole: string;
    readinessPercent: number;
    skillGaps: {
        skill: string;
        required: number;
        current: number;
        gap: number;
    }[];
}

export interface RecommendationExplanation {
    courseId: string;
    reason: string;
    evidence: string;
    confidence: string;
    limitations: string;
}
