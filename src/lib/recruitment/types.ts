export type ApplicationStatus = 'APPLIED' | 'SCREENING' | 'INTERVIEWING' | 'OFFER_EXTENDED' | 'OFFER_ACCEPTED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';

export interface JobRequisition {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'OPEN' | 'FILLED' | 'CANCELLED';
    requiredSkills: string[];
    preferredSkills: string[];
    minExperienceYears: number;
    headcountTarget: number;
    headcountFilled: number;
}

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    resumeUrl?: string;
    linkedInUrl?: string;
    // Extracted from resume
    extractedSkills: string[];
    extractedExperienceYears: number;
}

export interface ApplicationPipeline {
    id: string;
    requisitionId: string;
    candidateId: string;
    status: ApplicationStatus;
    appliedAt: string;
    screeningScore?: ScreeningMatch;
    interviews: InterviewScorecard[];
    offer?: Offer;
}

export interface ScreeningMatch {
    matchLevel: 'STRONG' | 'MODERATE' | 'WEAK';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    evidence: {
        skill: string;
        requirement: 'REQUIRED' | 'PREFERRED';
        found: boolean;
        years?: number;
    }[];
    gaps: string[];
    recommendation: string;
    limitations: string[];
}

export interface InterviewScorecard {
    id: string;
    interviewerId: string;
    type: 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'HIRING_MANAGER';
    overallScore: 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'NO_HIRE';
    feedback: string;
    submittedAt: string;
}

export interface Offer {
    id: string;
    annualCTC: number;
    currency: string;
    status: 'DRAFT' | 'EXTENDED' | 'ACCEPTED' | 'DECLINED';
    validUntil: string;
}
