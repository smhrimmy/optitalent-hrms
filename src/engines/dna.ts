import type { GeneratedConfig } from '@/lib/company-blueprint';
import { isModuleEnabled } from '@/lib/company-blueprint';

export const TENANT_ID = 'optitalent-demo';

export type CompanyDNA = GeneratedConfig & {
  tenantId: string;
  subIndustry: string;
  jobFamilies: string[];
  dashboardKeys: string[];
};

const JOB_FAMILIES: Record<string, string[]> = {
  technology: ['Engineering', 'Product', 'Design', 'Sales', 'People'],
  manufacturing: ['Production', 'Quality', 'Maintenance', 'EHS', 'Plant HR'],
  retail: ['Store ops', 'Cashiers', 'Visual merch', 'Regional'],
  healthcare: ['Clinical', 'Nursing', 'Allied', 'Admin'],
  banking: ['Branch', 'Risk', 'Ops', 'Audit'],
  professional_services: ['Delivery', 'Sales', 'Enablement'],
  logistics: ['Drivers', 'Warehouse', 'Dispatch'],
  construction: ['Site', 'QS', 'EHS', 'Corporate'],
  hospitality: ['FO', 'HK', 'F&B', 'Kitchen'],
  education: ['Faculty', 'Admin', 'Library'],
  nonprofit: ['Programs', 'Fundraising', 'Field'],
  government: ['Service', 'Policy', 'Ops'],
  other: ['General'],
};

const DASHBOARDS: Record<string, string[]> = {
  manufacturing: ['headcount', 'shift_coverage', 'absent', 'overtime', 'contractors', 'plants', 'safety', 'compliance', 'open_roles'],
  technology: ['headcount', 'hiring', 'attrition', 'utilization', 'skill_gaps', 'performance', 'learning'],
  retail: ['stores', 'coverage', 'absence', 'open_roles', 'shift_gaps', 'seasonal'],
  healthcare: ['headcount', 'credentials', 'clinical_coverage', 'mandatory_training', 'open_roles'],
  professional_services: ['headcount', 'utilization', 'bench', 'skill_gaps', 'projects'],
  logistics: ['drivers', 'routes', 'overtime', 'safety', 'headcount'],
  banking: ['headcount', 'compliance_training', 'audit', 'open_roles'],
};

export function toDNA(config: GeneratedConfig, tenantId = TENANT_ID): CompanyDNA {
  const industry = config.answers.industry;
  return {
    ...config,
    tenantId,
    subIndustry: industry,
    jobFamilies: JOB_FAMILIES[industry] || JOB_FAMILIES.other,
    dashboardKeys: DASHBOARDS[industry] || DASHBOARDS.technology,
  };
}

export function moduleOn(dna: CompanyDNA, id: string) {
  return isModuleEnabled(dna, id);
}
