import type { CompanyDNA } from './dna';
import { isModuleEnabled } from '@/lib/company-blueprint';

export type NavSpec = {
  label: string;
  href: string;
  module?: string;
};

function on(dna: CompanyDNA, moduleId: string) {
  return isModuleEnabled(dna, moduleId);
}

/** Sidebar is generated from DNA + persona + enabled modules. No universal menu. */
export function navSpecs(persona: string, dna: CompanyDNA): NavSpec[] {
  const industry = dna.answers.industry;
  const employee: NavSpec[] = [
    { label: 'Home', href: '/dashboard' },
    { label: 'My profile', href: '/profile' },
    { label: 'Attendance', href: '/attendance', module: 'attendance' },
    { label: 'Leave', href: '/leaves', module: 'leave' },
    { label: 'Payroll', href: '/payroll', module: 'payroll' },
    { label: 'Expenses', href: '/expenses', module: 'expenses' },
    { label: 'Goals', href: '/goals', module: 'goals' },
    { label: 'Learning', href: '/learning', module: 'learning' },
    { label: 'Career', href: '/career', module: 'career' },
    { label: 'Work health', href: '/work-health', module: 'ai' },
    { label: 'Help', href: '/helpdesk' },
  ];

  const manager: NavSpec[] = [
    { label: 'Home', href: '/dashboard' },
    { label: 'My team', href: '/employees', module: 'core_hr' },
    { label: 'Inbox', href: '/inbox' },
    { label: 'Attendance', href: '/attendance', module: 'attendance' },
    { label: 'Leave', href: '/leaves', module: 'leave' },
    { label: 'Goals', href: '/goals', module: 'goals' },
    { label: 'Performance', href: '/performance', module: 'performance' },
    { label: 'Hiring', href: '/recruitment', module: 'recruitment' },
    { label: 'Manager copilot', href: '/manager-copilot', module: 'ai' },
    { label: 'Reports', href: '/reports' },
    { label: 'Chief of Staff', href: '/ai-tools/chatbot', module: 'ai' },
  ];

  const hrCore: NavSpec[] = [
    { label: 'Command center', href: '/command-center', module: 'ai' },
    { label: 'People', href: '/employees', module: 'core_hr' },
    { label: 'Recruitment', href: '/recruitment', module: 'recruitment' },
    { label: 'Onboarding', href: '/onboarding', module: 'onboarding' },
    { label: 'Attendance', href: '/attendance', module: 'attendance' },
    { label: 'Leave', href: '/leaves', module: 'leave' },
    { label: 'Payroll', href: '/payroll', module: 'payroll' },
    { label: 'Performance', href: '/performance', module: 'performance' },
    { label: 'Learning', href: '/learning', module: 'learning' },
    { label: 'Compensation', href: '/compensation', module: 'payroll' },
    { label: 'Workforce twin', href: '/digital-twin', module: 'ai' },
    { label: 'Why', href: '/why', module: 'ai' },
    { label: 'Simulator', href: '/simulator', module: 'ai' },
    { label: 'Automation', href: '/workflows', module: 'ai' },
    { label: 'Lifecycle', href: '/lifecycle', module: 'onboarding' },
    { label: 'Chief of Staff', href: '/ai-tools/chatbot', module: 'ai' },
    { label: 'Company type', href: '/company-setup' },
    { label: 'Feature matrix', href: '/feature-matrix' },
    { label: 'Role builder', href: '/role-builder' },
    { label: 'Policy engine', href: '/policy-engine' },
    { label: 'Effective policy', href: '/effective-policy' },
    { label: 'Audit', href: '/audit' },
    { label: 'Settings', href: '/settings' },
  ];

  const industryExtra: NavSpec[] = [];
  if (industry === 'manufacturing' && on(dna, 'factory')) {
    industryExtra.push(
      { label: 'Plants', href: '/plants', module: 'factory' },
      { label: 'Shifts', href: '/shifts', module: 'shifts' },
      { label: 'Contractors', href: '/plants', module: 'contractors' }
    );
  }
  if (industry === 'retail' && on(dna, 'stores')) {
    industryExtra.push({ label: 'Stores', href: '/stores', module: 'stores' });
  }
  if (on(dna, 'credentials')) industryExtra.push({ label: 'Credentials', href: '/credentials', module: 'credentials' });
  if (on(dna, 'fleet')) industryExtra.push({ label: 'Fleet', href: '/fleet', module: 'fleet' });
  if (on(dna, 'sites')) industryExtra.push({ label: 'Sites', href: '/sites', module: 'sites' });

  if (persona === 'employee' || persona === 'trainee') return employee.filter((i) => !i.module || on(dna, i.module));
  if (persona === 'manager' || persona === 'team-leader') return manager.filter((i) => !i.module || on(dna, i.module));

  const hr = [...industryExtra, ...hrCore].filter((i) => !i.module || on(dna, i.module));
  const seen = new Set<string>();
  return hr.filter((i) => {
    if (seen.has(i.href)) return false;
    seen.add(i.href);
    return true;
  });
}
