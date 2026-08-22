import type { CompanyDNA } from './dna';
import { dataQuery } from '@/lib/dataquery';

export type DashWidget = {
  key: string;
  label: string;
  value: string;
  hint: string;
  whyHref?: string;
};

export function dashboardWidgets(dna: CompanyDNA): DashWidget[] {
  const stats = dataQuery.dashboardStats();
  const catalog: Record<string, DashWidget> = {
    headcount: { key: 'headcount', label: 'Headcount', value: String(stats.headcount), hint: 'Active staff', whyHref: '/why' },
    hiring: { key: 'hiring', label: 'Hiring', value: String(stats.openJobs), hint: 'Open roles', whyHref: '/why' },
    attrition: { key: 'attrition', label: 'Attrition attention', value: '—', hint: 'Open Why engine', whyHref: '/why' },
    utilization: { key: 'utilization', label: 'Utilization', value: '78%', hint: 'Billable / available', whyHref: '/why' },
    skill_gaps: { key: 'skill_gaps', label: 'Skill gaps', value: '17', hint: 'Critical skills watch', whyHref: '/talent-marketplace' },
    performance: { key: 'performance', label: 'Goals at risk', value: String(dataQuery.listGoals().filter((g) => g.status === 'At risk').length), hint: 'OKR engine', whyHref: '/goals' },
    learning: { key: 'learning', label: 'Courses', value: String(stats.courses), hint: 'Learning catalog', whyHref: '/learning' },
    shift_coverage: { key: 'shift_coverage', label: 'Shift coverage', value: '94%', hint: 'Plant roster', whyHref: '/plants' },
    absent: { key: 'absent', label: 'Absent workers', value: String(stats.pendingLeaves), hint: 'Leave + no-show', whyHref: '/leaves' },
    overtime: { key: 'overtime', label: 'Overtime', value: '↑', hint: 'Feeds payroll', whyHref: '/why' },
    contractors: { key: 'contractors', label: 'Contractors', value: dna.answers.contractors ? 'On' : 'Off', hint: 'Agency workforce', whyHref: '/plants' },
    plants: { key: 'plants', label: 'Plants', value: String(Math.max(1, dna.answers.locations)), hint: 'Factory locations', whyHref: '/plants' },
    safety: { key: 'safety', label: 'Safety training', value: 'Due', hint: 'EHS', whyHref: '/learning' },
    compliance: { key: 'compliance', label: 'Compliance', value: String(dataQuery.listCompliance().filter((c) => c.status !== 'Healthy').length), hint: 'Watch + action', whyHref: '/compliance-iq' },
    open_roles: { key: 'open_roles', label: 'Open positions', value: String(stats.openJobs), hint: 'ATS', whyHref: '/recruitment' },
    stores: { key: 'stores', label: 'Stores', value: String(Math.max(1, dna.answers.locations)), hint: 'Multi-store', whyHref: '/stores' },
    coverage: { key: 'coverage', label: 'Staff coverage', value: '91%', hint: 'Store roster', whyHref: '/stores' },
    absence: { key: 'absence', label: 'Absence', value: String(stats.pendingLeaves), hint: 'Store no-shows', whyHref: '/leaves' },
    shift_gaps: { key: 'shift_gaps', label: 'Shift gaps', value: '3 stores', hint: 'Tonight', whyHref: '/shifts' },
    seasonal: { key: 'seasonal', label: 'Seasonal seats', value: dna.answers.seasonal ? 'Open' : 'Off', hint: 'Peak hiring', whyHref: '/stores' },
    credentials: { key: 'credentials', label: 'License watch', value: '3', hint: 'Expiry', whyHref: '/credentials' },
    clinical_coverage: { key: 'clinical_coverage', label: 'Clinical coverage', value: '88%', hint: 'Staffing ratio', whyHref: '/credentials' },
    mandatory_training: { key: 'mandatory_training', label: 'Mandatory training', value: '12 due', hint: 'Compliance L&D', whyHref: '/learning' },
    bench: { key: 'bench', label: 'Bench', value: '4', hint: 'Unallocated', whyHref: '/timesheets' },
    projects: { key: 'projects', label: 'Projects', value: String(dataQuery.listTimesheets().length), hint: 'Allocations', whyHref: '/timesheets' },
    drivers: { key: 'drivers', label: 'Drivers on route', value: '2', hint: 'Fleet', whyHref: '/fleet' },
    routes: { key: 'routes', label: 'Active routes', value: '2', hint: 'Dispatch', whyHref: '/fleet' },
    audit: { key: 'audit', label: 'Audit items', value: String(stats.pendingApprovals), hint: 'Governance', whyHref: '/audit' },
    compliance_training: { key: 'compliance_training', label: 'Policy acks', value: '94%', hint: 'Banking SoD', whyHref: '/compliance-iq' },
  };

  return dna.dashboardKeys.map((k) => catalog[k]).filter(Boolean);
}
