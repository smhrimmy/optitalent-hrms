// Company Configuration Models

export type IndustryType = 'Technology' | 'Manufacturing' | 'Retail' | 'Healthcare' | 'Banking' | 'Education' | 'Hospitality' | 'Logistics' | 'Construction' | 'Professional Services' | 'Nonprofit' | 'Government' | 'Other';
export type CompanySize = '1-25' | '26-100' | '101-500' | '501-2000' | '2001-10000' | '10000+';
export type WorkModel = 'Office' | 'Hybrid' | 'Remote' | 'Field' | 'Factory' | 'Store' | 'Project' | '24/7';
export type OperatingModel = 'Department-based' | 'Project-based' | 'Location-based' | 'Store-based' | 'Plant-based' | 'Matrix' | 'Mixed';

export interface CompanyDNA {
  companyId: string;
  name: string;
  legalName: string;
  industry: IndustryType;
  subIndustry?: string;
  size: CompanySize;
  geography: {
    countries: string[];
    regions: string[];
    states: string[];
    legalEntities: string[];
    locations: string[];
  };
  workforceTypes: string[];
  workModels: WorkModel[];
  operatingModel: OperatingModel;
  payroll: {
    countries: string[];
    payFrequency: string;
    currency: string;
  };
  enabledModules: string[];
  enabledFeatures: string[];
  version: number;
  lastUpdated: string;
}

export interface IndustryBlueprint {
  industry: IndustryType;
  version: string;
  recommendedModules: string[];
  recommendedWorkforceTypes: string[];
  recommendedPolicies: string[];
  recommendedWorkflows: string[];
  recommendedRoles: string[];
  recommendedFields: string[];
  recommendedDashboards: string[];
}
