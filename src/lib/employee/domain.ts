export type ActionPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type RequestStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface EmployeeActionItem {
    id: string;
    title: string;
    description: string;
    priority: ActionPriority;
    dueDate?: string;
    source: 'HR' | 'MANAGER' | 'SYSTEM' | 'SECURITY';
    actionLabel: string;
    actionUrl: string;
}

export interface EmployeeRequest {
    id: string;
    type: 'LEAVE' | 'EXPENSE' | 'HELPDESK' | 'ASSET' | 'PAYROLL';
    title: string;
    status: RequestStatus;
    submittedAt: string;
    updatedAt: string;
    timeline: {
        status: RequestStatus;
        timestamp: string;
        note?: string;
    }[];
}

export interface EmployeeActivity {
    id: string;
    timestamp: string;
    description: string;
    category: 'ATTENDANCE' | 'PERFORMANCE' | 'LEARNING' | 'DOCUMENT' | 'REQUEST';
}

export interface EmployeeSkill {
    id: string;
    name: string;
    level: number; // 0-100
    verified: boolean;
    evidenceSource?: string;
}

export interface CareerTarget {
    id: string;
    title: string;
    readinessScore: number;
    skillGaps: {
        skillName: string;
        currentLevel: number;
        requiredLevel: number;
    }[];
    recommendedLearning: {
        id: string;
        title: string;
        reason: string;
    }[];
}

export interface EmployeeProfile {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    department: string;
    email: string;
    phone?: string;
    managerId?: string;
    managerName?: string;
    location: string;
    employmentType: string;
    startDate: string;
    completenessScore: number;
    missingFields: string[];
}

export interface EmployeeGoal {
    id: string;
    title: string;
    description: string;
    target: string;
    progress: number;
    status: 'NOT_STARTED' | 'ON_TRACK' | 'AT_RISK' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';
    dueDate: string;
    verifiedEvidenceCount: number;
}

export interface EmployeeCourse {
    id: string;
    title: string;
    provider: string;
    duration: string;
    status: 'NOT_ENROLLED' | 'ENROLLED' | 'IN_PROGRESS' | 'ASSESSMENT_PENDING' | 'PASSED' | 'FAILED' | 'COMPLETED';
    progress: number;
    isRequired: boolean;
    reason?: string;
    targetSkill?: string;
}

export interface EmployeeDocument {
    id: string;
    title: string;
    category: 'Identity' | 'Employment' | 'Payroll' | 'Tax' | 'Benefits' | 'Education' | 'Compliance' | 'Other';
    documentType: string;
    status: 'DRAFT' | 'REQUESTED' | 'PENDING_UPLOAD' | 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'ARCHIVED';
    issuedAt?: string;
    expiresAt?: string;
    uploadedAt?: string;
    verifiedAt?: string;
    version: string;
    source: string;
    isRequired: boolean;
    reasonRequired?: string;
}

export interface EmployeeNotification {
    id: string;
    type: string;
    category: 'ACTION_REQUIRED' | 'APPROVAL' | 'WORKFLOW' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL' | 'DOCUMENT' | 'LEARNING' | 'PERFORMANCE' | 'BENEFITS' | 'EXPENSE' | 'ASSET' | 'HELPDESK' | 'SECURITY' | 'SYSTEM' | 'AI';
    title: string;
    message: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'EXPIRED';
    createdAt: string;
    action?: {
        label: string;
        href: string;
    };
    source: string;
    isAI?: boolean;
    aiEvidence?: string;
}

export interface EmployeeActivityEvent {
    id: string;
    category: 'Career' | 'Performance' | 'Learning' | 'Documents' | 'Payroll' | 'Benefits' | 'Requests' | 'Attendance' | 'Lifecycle';
    title: string;
    description: string;
    occurredAt: string;
    source: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
}

export class EmployeeContextService {
    // MOCK DATA LAYER

    static async getNotifications(employeeId: string): Promise<EmployeeNotification[]> {
        return [
            {
                id: 'notif-1',
                type: 'document_expiring',
                category: 'DOCUMENT',
                title: 'Document Expires Soon',
                message: 'Your Information Security Policy Acknowledgement expires in 30 days.',
                priority: 'HIGH',
                status: 'UNREAD',
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                action: { label: 'Update document', href: '/employee/documents/required' },
                source: 'Compliance'
            },
            {
                id: 'notif-2',
                type: 'ai_insight',
                category: 'AI',
                title: 'AI Workforce Insight',
                message: 'Based on your recent project completion, you are ready for the Advanced System Design course.',
                priority: 'NORMAL',
                status: 'UNREAD',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                action: { label: 'View recommendation', href: '/employee/learning' },
                source: 'AI Workforce Agent',
                isAI: true,
                aiEvidence: 'Matches 85% of target role skill gaps.'
            },
            {
                id: 'notif-3',
                type: 'leave_approved',
                category: 'LEAVE',
                title: 'Leave Request Approved',
                message: 'Your Annual Leave request for next week has been approved by your manager.',
                priority: 'NORMAL',
                status: 'READ',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                action: { label: 'View request', href: '/employee/requests/leave-1' },
                source: 'Manager'
            }
        ];
    }

    static async getActivity(employeeId: string): Promise<EmployeeActivityEvent[]> {
        return [
            {
                id: 'act-1',
                category: 'Performance',
                title: 'Goal Completed',
                description: 'Complete API migration',
                occurredAt: new Date().toISOString(), // Today
                source: 'Performance Engine',
                relatedEntityType: 'Goal',
                relatedEntityId: 'goal-1'
            },
            {
                id: 'act-2',
                category: 'Learning',
                title: 'Course Completed',
                description: 'Advanced System Design',
                occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
                source: 'Learning Engine',
                relatedEntityType: 'Course',
                relatedEntityId: 'course-1'
            },
            {
                id: 'act-3',
                category: 'Lifecycle',
                title: 'Promotion',
                description: 'Software Engineer → Senior Software Engineer',
                occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
                source: 'HR System',
                relatedEntityType: 'LifecycleEvent'
            }
        ];
    }

    static async getDocuments(employeeId: string): Promise<EmployeeDocument[]> {
        return [
            {
                id: 'doc-1',
                title: 'Employment Contract',
                category: 'Employment',
                documentType: 'Employment Contract',
                status: 'VERIFIED',
                issuedAt: '2025-01-15T00:00:00Z',
                uploadedAt: '2025-01-16T00:00:00Z',
                verifiedAt: '2025-01-17T00:00:00Z',
                version: 'v1',
                source: 'HR System',
                isRequired: true
            },
            {
                id: 'doc-2',
                title: 'August 2026 Payslip',
                category: 'Payroll',
                documentType: 'Payslip',
                status: 'VERIFIED',
                issuedAt: '2026-08-31T00:00:00Z',
                version: 'v1',
                source: 'Payroll System',
                isRequired: false
            },
            {
                id: 'doc-3',
                title: 'Information Security Policy Acknowledgement',
                category: 'Compliance',
                documentType: 'Policy Acknowledgement',
                status: 'PENDING_UPLOAD',
                expiresAt: '2026-09-15T00:00:00Z',
                version: 'v2',
                source: 'Policy Engine',
                isRequired: true,
                reasonRequired: 'Annual company-wide compliance requirement'
            }
        ];
    }

    static async getGoals(employeeId: string): Promise<EmployeeGoal[]> {
        return [
            {
                id: 'goal-1',
                title: 'API Modernization',
                description: 'Migrate legacy REST endpoints to GraphQL.',
                target: '100% completion',
                progress: 82,
                status: 'ON_TRACK',
                dueDate: '2026-12-31T00:00:00Z',
                verifiedEvidenceCount: 2
            },
            {
                id: 'goal-2',
                title: 'Cloud Architecture Certification',
                description: 'Pass the advanced AWS certification.',
                target: 'Certificate acquired',
                progress: 50,
                status: 'AT_RISK',
                dueDate: '2026-09-30T00:00:00Z',
                verifiedEvidenceCount: 0
            }
        ];
    }

    static async getCourses(employeeId: string): Promise<EmployeeCourse[]> {
        return [
            {
                id: 'course-1',
                title: 'Advanced System Design',
                provider: 'OptiTalent Learning',
                duration: '4h 30m',
                status: 'IN_PROGRESS',
                progress: 45,
                isRequired: false,
                targetSkill: 'System Design',
                reason: 'Recommended based on skill gap for Staff Software Engineer.'
            },
            {
                id: 'course-2',
                title: '2026 Security Compliance',
                provider: 'Infosec Dept',
                duration: '45m',
                status: 'NOT_ENROLLED',
                progress: 0,
                isRequired: true,
                reason: 'Company policy requires annual completion.'
            }
        ];
    }

    static async getProfile(employeeId: string): Promise<EmployeeProfile> {
        return {
            id: employeeId,
            firstName: 'Ravi',
            lastName: 'Kumar',
            title: 'Senior Software Engineer',
            department: 'Engineering',
            email: 'ravi.kumar@example.com',
            phone: '+1 555-0100',
            managerId: 'mgr-1',
            managerName: 'Sarah Chen',
            location: 'San Francisco (Hybrid)',
            employmentType: 'Full-time',
            startDate: '2023-01-15T00:00:00Z',
            completenessScore: 87,
            missingFields: ['Emergency contact', 'Tax information']
        };
    }

    static async getCareerTarget(employeeId: string): Promise<CareerTarget> {
        return {
            id: 'role-lead',
            title: 'Staff Software Engineer',
            readinessScore: 72,
            skillGaps: [
                { skillName: 'System Design', currentLevel: 62, requiredLevel: 90 },
                { skillName: 'Cloud Architecture', currentLevel: 54, requiredLevel: 80 },
                { skillName: 'Leadership', currentLevel: 41, requiredLevel: 75 }
            ],
            recommendedLearning: [
                { id: 'lrn-1', title: 'Advanced System Design', reason: 'Your current backend evidence demonstrates strong implementation skills, but verified system-design evidence is limited.' },
                { id: 'lrn-2', title: 'Technical Leadership Foundations', reason: 'Required for progression to Staff-level roles.' }
            ]
        };
    }
    
    static async getPendingActions(employeeId: string): Promise<EmployeeActionItem[]> {
        return [
            {
                id: 'act-1',
                title: 'Performance Review Due',
                description: 'Your self-review for Q3 is due tomorrow.',
                priority: 'HIGH',
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                source: 'HR',
                actionLabel: 'Continue Review',
                actionUrl: '/employee/performance'
            },
            {
                id: 'act-2',
                title: 'Sign Updated Code of Conduct',
                description: 'Please review and acknowledge the updated 2026 policy.',
                priority: 'NORMAL',
                source: 'COMPLIANCE',
                actionLabel: 'Review Document',
                actionUrl: '/employee/documents'
            }
        ];
    }

    static async getRecentRequests(employeeId: string): Promise<EmployeeRequest[]> {
        return [
            {
                id: 'req-101',
                type: 'LEAVE',
                title: 'Annual Leave (3 days)',
                status: 'UNDER_REVIEW',
                submittedAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 40000000).toISOString(),
                timeline: [
                    { status: 'SUBMITTED', timestamp: new Date(Date.now() - 86400000).toISOString() },
                    { status: 'UNDER_REVIEW', timestamp: new Date(Date.now() - 40000000).toISOString(), note: 'Manager reviewing coverage.' }
                ]
            }
        ];
    }
    
    static async getTodaySchedule(employeeId: string) {
        return {
            shift: '09:00 AM - 06:00 PM',
            clockIn: '09:02 AM',
            clockOut: null,
            status: 'WORKING'
        };
    }
}
