export interface OrganizationNode {
    id: string;
    type: 'Company' | 'Department' | 'Team' | 'Location';
    name: string;
    parentId?: string;
    managerId?: string;
    activeHeadcount: number;
}

export interface SkillNode {
    id: string;
    name: string;
    category: string;
    verifiedProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    evidence: string[];
}

export interface EmployeeProfile {
    id: string;
    name: string;
    departmentId: string;
    managerId?: string;
    jobRole: string;
    skills: SkillNode[];
    activeProjects: string[];
    leaveBalanceDays: number;
    projectAllocationPercentage: number; // 0-100
}

export interface HeadcountSnapshot {
    date: string;
    totalActive: number;
    byDepartment: Record<string, number>;
    byLocation: Record<string, number>;
}

export interface DigitalTwinGraph {
    companyId: string;
    lastUpdated: string;
    organizationNodes: Map<string, OrganizationNode>;
    employees: Map<string, EmployeeProfile>;
    historicalHeadcount: HeadcountSnapshot[];
}
