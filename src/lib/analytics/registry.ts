export type MetricFreshness = 'realtime' | 'eventually_consistent' | 'daily_snapshot' | 'monthly_snapshot';

export interface MetricDefinition {
    id: string;
    name: string;
    description: string;
    sourceDomain: string; // e.g. 'Workforce', 'Payroll'
    dimensions: string[]; // e.g. ['department', 'location', 'entity', 'employmentType']
    requiredPermissions: string[]; // e.g. ['employee.aggregate.read']
    freshness: MetricFreshness;
    isSensitive: boolean; // if true, privacy threshold aggregation applies
}

export const MetricRegistry: Record<string, MetricDefinition> = {
    'headcount': {
        id: 'headcount',
        name: 'Headcount',
        description: 'Active employees at period end.',
        sourceDomain: 'Workforce',
        dimensions: ['department', 'location', 'entity', 'employmentType'],
        requiredPermissions: ['employee.aggregate.read'],
        freshness: 'eventually_consistent',
        isSensitive: false
    },
    'attrition_rate': {
        id: 'attrition_rate',
        name: 'Attrition Rate',
        description: 'Percentage of active employees who exited during the period.',
        sourceDomain: 'Workforce',
        dimensions: ['department', 'location', 'tenure_band'],
        requiredPermissions: ['employee.aggregate.read'],
        freshness: 'daily_snapshot',
        isSensitive: false
    },
    'avg_compensation': {
        id: 'avg_compensation',
        name: 'Average Compensation',
        description: 'Average base salary for the selected group.',
        sourceDomain: 'Payroll',
        dimensions: ['department', 'location', 'role'],
        requiredPermissions: ['payroll.aggregate.read'],
        freshness: 'monthly_snapshot',
        isSensitive: true // Requires aggregation threshold enforcement
    },
    'skill_coverage': {
        id: 'skill_coverage',
        name: 'Skill Coverage',
        description: 'Percentage of required skills actively possessed by the team.',
        sourceDomain: 'Talent',
        dimensions: ['department', 'role'],
        requiredPermissions: ['skills.aggregate.read'],
        freshness: 'eventually_consistent',
        isSensitive: false
    },
    'overtime_hours': {
        id: 'overtime_hours',
        name: 'Overtime Hours',
        description: 'Total overtime hours logged.',
        sourceDomain: 'Attendance',
        dimensions: ['department', 'location', 'plant'],
        requiredPermissions: ['attendance.aggregate.read'],
        freshness: 'eventually_consistent',
        isSensitive: false
    }
};
