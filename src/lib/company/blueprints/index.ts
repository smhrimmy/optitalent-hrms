import { IndustryBlueprint } from '../types';

export const manufacturingBlueprint: IndustryBlueprint = {
    industry: 'Manufacturing',
    version: '1.0',
    recommendedModules: [
        'core_hr',
        'recruitment',
        'shift_management',
        'attendance',
        'overtime',
        'plant_management',
        'contractors',
        'safety',
        'certifications',
        'payroll',
        'compliance'
    ],
    recommendedWorkforceTypes: ['Full-time', 'Contractor', 'Apprentice', 'Temporary'],
    recommendedPolicies: ['ManufacturingShiftPolicy', 'OvertimePolicy', 'SafetyCompliancePolicy'],
    recommendedWorkflows: ['ShiftSwap', 'OvertimeApproval', 'SafetyIncidentReport'],
    recommendedRoles: ['Plant Manager', 'Shift Supervisor', 'Safety Officer', 'Contractor Manager'],
    recommendedFields: ['plantId', 'workerCategory', 'shiftId', 'safetyCertificationStatus'],
    recommendedDashboards: ['manufacturing_overview', 'shift_coverage']
};

export const technologyBlueprint: IndustryBlueprint = {
    industry: 'Technology',
    version: '1.0',
    recommendedModules: [
        'core_hr',
        'recruitment',
        'onboarding',
        'performance',
        'goals',
        'skills',
        'learning',
        'projects',
        'timesheets',
        'expenses',
        'assets',
        'remote_work'
    ],
    recommendedWorkforceTypes: ['Full-time', 'Contractor', 'Intern'],
    recommendedPolicies: ['RemoteWorkPolicy', 'FlexibleHoursPolicy', 'EquipmentPolicy'],
    recommendedWorkflows: ['AssetAssignment', 'PerformanceReview', 'ProjectAllocation'],
    recommendedRoles: ['Engineering Manager', 'Project Manager', 'HRBP', 'Recruiter'],
    recommendedFields: ['skills', 'projects', 'certifications'],
    recommendedDashboards: ['tech_overview', 'project_allocation']
};

export const retailBlueprint: IndustryBlueprint = {
    industry: 'Retail',
    version: '1.0',
    recommendedModules: [
        'core_hr',
        'store_management',
        'shift_scheduling',
        'geo_attendance',
        'seasonal_workforce',
        'incentives',
        'sales_targets',
        'payroll'
    ],
    recommendedWorkforceTypes: ['Full-time', 'Part-time', 'Seasonal', 'Temporary'],
    recommendedPolicies: ['StoreAttendancePolicy', 'IncentivePolicy'],
    recommendedWorkflows: ['SeasonalHire', 'StoreTransfer', 'IncentiveApproval'],
    recommendedRoles: ['Store Manager', 'Area Manager', 'Regional HR'],
    recommendedFields: ['storeId', 'regionId', 'salesRole'],
    recommendedDashboards: ['retail_overview', 'store_coverage']
};

export const healthcareBlueprint: IndustryBlueprint = {
    industry: 'Healthcare',
    version: '1.0',
    recommendedModules: [
        'core_hr',
        'credential_management',
        'license_tracking',
        'clinical_scheduling',
        'on_call',
        'compliance',
        'training'
    ],
    recommendedWorkforceTypes: ['Full-time', 'Part-time', 'Consultant', 'Agency Worker'],
    recommendedPolicies: ['ClinicalCompliancePolicy', 'OnCallPolicy'],
    recommendedWorkflows: ['CredentialRenewal', 'LicenseVerification', 'OnCallAssignment'],
    recommendedRoles: ['Clinical Manager', 'Credentialing Officer', 'Department Head'],
    recommendedFields: ['licenseNumber', 'licenseType', 'licenseExpiry'],
    recommendedDashboards: ['healthcare_overview', 'credential_status']
};

export const industryBlueprints: Record<string, IndustryBlueprint> = {
    Manufacturing: manufacturingBlueprint,
    Technology: technologyBlueprint,
    Retail: retailBlueprint,
    Healthcare: healthcareBlueprint
};

export function getBlueprint(industry: string): IndustryBlueprint | undefined {
    return industryBlueprints[industry];
}
