/**
 * Company Type Engine — industry + size + workforce + geography
 * generate the HRMS instead of showing every module.
 */

export const INDUSTRIES = [
  'technology',
  'manufacturing',
  'retail',
  'healthcare',
  'banking',
  'education',
  'hospitality',
  'logistics',
  'construction',
  'professional_services',
  'nonprofit',
  'government',
  'other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const SIZE_BANDS = [
  { id: '1-25', label: '1–25 · simple HRMS', employees: 20 },
  { id: '26-100', label: '26–100 · growing company', employees: 50 },
  { id: '101-500', label: '101–500 · mid-market', employees: 250 },
  { id: '501-2000', label: '501–2,000 · enterprise HCM', employees: 1200 },
  { id: '2001-10000', label: '2,001–10,000 · multi-entity', employees: 5000 },
  { id: '10000+', label: '10,000+ · global workforce OS', employees: 50000 },
] as const;

export type SizeBand = (typeof SIZE_BANDS)[number]['id'];

export const WORK_MODELS = ['office', 'remote', 'hybrid', 'field', 'factory', 'store', 'project', 'shift', '24/7'] as const;
export type WorkModel = (typeof WORK_MODELS)[number];

export const WORKER_TYPES = [
  'Full-time',
  'Part-time',
  'Contractor',
  'Consultant',
  'Intern',
  'Apprentice',
  'Temporary',
  'Seasonal',
  'Freelancer',
  'Volunteer',
  'Agency worker',
] as const;

export type WorkerType = (typeof WORKER_TYPES)[number];

export type ModuleAvailability = 'available' | 'industry-only' | 'country-specific' | 'premium' | 'beta';
export type ModuleState = 'enabled' | 'disabled' | 'beta';

export type RegistryModule = {
  id: string;
  label: string;
  category: string;
  description: string;
  availability: ModuleAvailability;
  industries?: Industry[];
  navFeature?: string;
};

export const MODULE_REGISTRY: RegistryModule[] = [
  { id: 'core_hr', label: 'Core HR', category: 'Core', description: 'Profiles, entities, documents', availability: 'available', navFeature: 'employee_management' },
  { id: 'recruitment', label: 'Recruitment', category: 'Talent', description: 'Reqs, ATS, offers', availability: 'available', navFeature: 'recruitment' },
  { id: 'onboarding', label: 'Onboarding', category: 'Core', description: 'Joiners, documents, induction', availability: 'available', navFeature: 'employee_management' },
  { id: 'attendance', label: 'Attendance', category: 'Operations', description: 'Punch, GPS, status', availability: 'available', navFeature: 'attendance' },
  { id: 'leave', label: 'Leave', category: 'Operations', description: 'Types, balances, approvals', availability: 'available', navFeature: 'leave' },
  { id: 'payroll', label: 'Payroll', category: 'Finance', description: 'Salary, PF/ESI/TDS, payslips', availability: 'available', navFeature: 'payroll' },
  { id: 'expenses', label: 'Expenses', category: 'Finance', description: 'Claims and reimbursements', availability: 'available', navFeature: 'expenses' },
  { id: 'performance', label: 'Performance', category: 'Talent', description: 'Reviews, 360, PIP', availability: 'available', navFeature: 'performance' },
  { id: 'goals', label: 'Goals / OKRs', category: 'Talent', description: 'Cascading objectives', availability: 'available', navFeature: 'performance' },
  { id: 'learning', label: 'Learning', category: 'Talent', description: 'Courses and certifications', availability: 'available', navFeature: 'training' },
  { id: 'skills', label: 'Skills', category: 'Talent', description: 'Skills graph and gaps', availability: 'available', navFeature: 'ai_tools' },
  { id: 'career', label: 'Career / mobility', category: 'Talent', description: 'Internal marketplace', availability: 'available', navFeature: 'ai_tools' },
  { id: 'projects', label: 'Projects', category: 'Operations', description: 'Allocation and clients', availability: 'available', navFeature: 'timesheets' },
  { id: 'timesheets', label: 'Timesheets', category: 'Operations', description: 'Billable hours, utilization', availability: 'available', navFeature: 'timesheets' },
  { id: 'travel', label: 'Travel', category: 'Finance', description: 'Requests and policy', availability: 'available', navFeature: 'expenses' },
  { id: 'assets', label: 'Assets', category: 'Operations', description: 'Laptops, uniforms, kit', availability: 'available', navFeature: 'assets' },
  { id: 'helpdesk', label: 'Helpdesk', category: 'Core', description: 'HR/IT requests', availability: 'available' },
  { id: 'engagement', label: 'Engagement', category: 'Talent', description: 'Surveys and pulse', availability: 'available' },
  { id: 'recognition', label: 'Recognition', category: 'Talent', description: 'Kudos and rewards', availability: 'available' },
  { id: 'workforce_planning', label: 'Workforce planning', category: 'Intelligence', description: 'Headcount and simulation', availability: 'premium', navFeature: 'ai_tools' },
  { id: 'compliance', label: 'Compliance', category: 'Governance', description: 'Statutory and policy', availability: 'available', navFeature: 'compliance' },
  { id: 'ai', label: 'AI / People OS', category: 'Intelligence', description: 'Twin, why, Chief of Staff', availability: 'available', navFeature: 'ai_tools' },
  { id: 'analytics', label: 'Analytics', category: 'Intelligence', description: 'People command center', availability: 'available', navFeature: 'ai_tools' },
  { id: 'factory', label: 'Plant / factory workforce', category: 'Industry', description: 'Plants, muster, rotating shifts', availability: 'industry-only', industries: ['manufacturing'], navFeature: 'factory' },
  { id: 'shifts', label: 'Shift engine', category: 'Industry', description: 'Rotations, night, weekly offs', availability: 'industry-only', industries: ['manufacturing', 'hospitality', 'healthcare', 'logistics', 'retail'], navFeature: 'attendance' },
  { id: 'overtime', label: 'Overtime & allowances', category: 'Industry', description: 'OT, night allowance, payroll feed', availability: 'industry-only', industries: ['manufacturing', 'logistics', 'hospitality', 'retail'], navFeature: 'payroll' },
  { id: 'contractors', label: 'Contractor workforce', category: 'Industry', description: 'Agency and site contractors', availability: 'industry-only', industries: ['manufacturing', 'construction', 'logistics'], navFeature: 'factory' },
  { id: 'safety', label: 'Safety training', category: 'Industry', description: 'Mandatory safety and incidents', availability: 'industry-only', industries: ['manufacturing', 'construction', 'logistics'], navFeature: 'training' },
  { id: 'stores', label: 'Store management', category: 'Industry', description: 'Region → store → department', availability: 'industry-only', industries: ['retail'], navFeature: 'stores' },
  { id: 'seasonal', label: 'Seasonal / temp workforce', category: 'Industry', description: 'Peak hiring and coverage', availability: 'industry-only', industries: ['retail', 'hospitality', 'nonprofit'], navFeature: 'stores' },
  { id: 'commissions', label: 'Incentives & commission', category: 'Industry', description: 'Sales targets and store incentives', availability: 'industry-only', industries: ['retail'], navFeature: 'stores' },
  { id: 'credentials', label: 'Clinical credentials', category: 'Industry', description: 'Licenses, expiry, eligibility', availability: 'industry-only', industries: ['healthcare', 'education'], navFeature: 'credentials' },
  { id: 'clinical_shifts', label: 'Clinical / on-call roster', category: 'Industry', description: '24/7 staffing ratios', availability: 'industry-only', industries: ['healthcare'], navFeature: 'credentials' },
  { id: 'fleet', label: 'Fleet & drivers', category: 'Industry', description: 'License, vehicle, trip pay', availability: 'industry-only', industries: ['logistics'], navFeature: 'fleet' },
  { id: 'sites', label: 'Construction sites', category: 'Industry', description: 'Project → site → contractor → worker', availability: 'industry-only', industries: ['construction'], navFeature: 'sites' },
  { id: 'faculty', label: 'Faculty / academic', category: 'Industry', description: 'Tenure, teaching load, campus', availability: 'industry-only', industries: ['education'], navFeature: 'faculty' },
  { id: 'hospitality', label: 'Property departments', category: 'Industry', description: 'FO, HK, F&B, tips, uniforms', availability: 'industry-only', industries: ['hospitality'], navFeature: 'hospitality' },
  { id: 'governance', label: 'Banking governance', category: 'Industry', description: 'SoD, COI, audit, BGV', availability: 'industry-only', industries: ['banking', 'government'], navFeature: 'compliance' },
  { id: 'volunteers', label: 'Volunteers & grants', category: 'Industry', description: 'Volunteer workforce, grant compliance', availability: 'industry-only', industries: ['nonprofit'], navFeature: 'volunteers' },
  { id: 'offboarding', label: 'Offboarding', category: 'Core', description: 'Exit, assets, F&F', availability: 'available', navFeature: 'offboarding' },
  { id: 'org_chart', label: 'Org chart', category: 'Core', description: 'Hierarchy and matrix', availability: 'available', navFeature: 'org_chart' },
];

export const PROFILE_FIELDS = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'salary', label: 'Salary' },
  { id: 'bank', label: 'Bank account' },
  { id: 'tax', label: 'Tax information' },
  { id: 'performance', label: 'Performance' },
  { id: 'medical', label: 'Medical information' },
] as const;

export type FieldId = (typeof PROFILE_FIELDS)[number]['id'];
export type FieldAccess = 'hidden' | 'view' | 'edit';

export type AccessRole = {
  id: string;
  name: string;
  description: string;
  system: boolean;
  scope: {
    locations: string[];
    departments: string[];
    regions: string[];
    workerTypes: string[];
    entities: string[];
  };
  modules: Record<string, string[]>;
  fields: Record<FieldId, FieldAccess>;
};

export type PolicyRule = {
  id: string;
  name: string;
  kind: 'leave' | 'overtime' | 'expense' | 'attendance' | 'approval';
  when: { field: string; op: 'eq' | 'gt' | 'in'; value: string | number | string[] }[];
  then: string;
  layer: 'global' | 'country' | 'state' | 'location' | 'department' | 'job' | 'employment_type' | 'employee';
};

export type ApprovalRule = {
  id: string;
  trigger: string;
  bands: { when: string; approvers: string[] }[];
};

export type OrgNode = { name: string; children?: OrgNode[] };

export type CompanyAnswers = {
  name: string;
  industry: Industry;
  sizeBand: SizeBand;
  countries: string[];
  states: string[];
  entities: number;
  locations: number;
  workModel: WorkModel;
  workforceMix: 'white-collar' | 'blue-collar' | 'mixed';
  payroll: 'monthly' | 'weekly' | 'daily';
  contractors: boolean;
  licensedProfessionals: boolean;
  shifts: boolean;
  seasonal: boolean;
  multiCountry: boolean;
};

export type GeneratedConfig = {
  answers: CompanyAnswers;
  edition: 'simple' | 'mid-market' | 'enterprise' | 'global';
  modules: { id: string; state: ModuleState; scope: string }[];
  orgModel: OrgNode;
  workerTypes: WorkerType[];
  roles: AccessRole[];
  policies: PolicyRule[];
  approvals: ApprovalRule[];
  relationships: string[];
};

export const INDUSTRY_LABEL: Record<Industry, string> = {
  technology: 'Technology / software',
  manufacturing: 'Manufacturing',
  retail: 'Retail',
  healthcare: 'Healthcare',
  banking: 'Banking / financial services',
  education: 'Education',
  hospitality: 'Hospitality',
  logistics: 'Logistics / transportation',
  construction: 'Construction',
  professional_services: 'Professional services / consulting',
  nonprofit: 'Nonprofit',
  government: 'Government',
  other: 'Other',
};

function editionFor(size: SizeBand): GeneratedConfig['edition'] {
  if (size === '1-25' || size === '26-100') return 'simple';
  if (size === '101-500') return 'mid-market';
  if (size === '501-2000' || size === '2001-10000') return 'enterprise';
  return 'global';
}

const CORE = ['core_hr', 'recruitment', 'onboarding', 'leave', 'attendance', 'payroll', 'helpdesk', 'offboarding', 'org_chart'];

const BY_INDUSTRY: Record<Industry, string[]> = {
  technology: [...CORE, 'performance', 'goals', 'skills', 'career', 'learning', 'expenses', 'timesheets', 'projects', 'assets', 'ai', 'analytics', 'engagement', 'recognition'],
  manufacturing: [...CORE, 'factory', 'shifts', 'overtime', 'contractors', 'safety', 'learning', 'skills', 'performance', 'workforce_planning', 'compliance', 'ai'],
  retail: [...CORE, 'stores', 'shifts', 'seasonal', 'commissions', 'overtime', 'performance', 'recruitment', 'ai'],
  healthcare: [...CORE, 'credentials', 'clinical_shifts', 'shifts', 'learning', 'compliance', 'workforce_planning', 'ai'],
  banking: [...CORE, 'governance', 'learning', 'compliance', 'performance', 'goals', 'ai', 'analytics'],
  education: [...CORE, 'faculty', 'credentials', 'learning', 'performance', 'leave'],
  hospitality: [...CORE, 'hospitality', 'shifts', 'seasonal', 'overtime', 'assets', 'learning'],
  logistics: [...CORE, 'fleet', 'shifts', 'overtime', 'contractors', 'safety', 'compliance'],
  construction: [...CORE, 'sites', 'contractors', 'safety', 'overtime', 'compliance', 'assets'],
  professional_services: [...CORE, 'projects', 'timesheets', 'skills', 'career', 'performance', 'goals', 'learning', 'ai'],
  nonprofit: [...CORE, 'volunteers', 'expenses', 'projects', 'compliance', 'engagement'],
  government: [...CORE, 'governance', 'compliance', 'learning', 'leave', 'payroll'],
  other: [...CORE, 'performance', 'expenses', 'ai'],
};

export function orgModelFor(industry: Industry): OrgNode {
  switch (industry) {
    case 'manufacturing':
      return { name: 'Company', children: [{ name: 'Plant A', children: [{ name: 'Production' }, { name: 'Quality' }, { name: 'Maintenance' }] }, { name: 'Plant B' }, { name: 'Corporate HR' }] };
    case 'retail':
      return {
        name: 'Company',
        children: [
          { name: 'South region', children: [{ name: 'Area Bengaluru', children: [{ name: 'Store #104', children: [{ name: 'Sales' }, { name: 'Cashiers' }, { name: 'Security' }] }] }] },
          { name: 'Regional HR' },
        ],
      };
    case 'healthcare':
      return { name: 'Hospital', children: [{ name: 'Doctors' }, { name: 'Nursing' }, { name: 'Technicians' }, { name: 'Pharmacy' }, { name: 'Administration' }, { name: 'Housekeeping' }] };
    case 'banking':
      return { name: 'Bank', children: [{ name: 'Branches' }, { name: 'Relationship managers' }, { name: 'Operations' }, { name: 'Risk' }, { name: 'Compliance' }, { name: 'Audit' }] };
    case 'education':
      return { name: 'University', children: [{ name: 'Faculty' }, { name: 'Departments' }, { name: 'Administration' }, { name: 'Research' }, { name: 'Library' }, { name: 'Contract staff' }] };
    case 'hospitality':
      return { name: 'Hotel / property', children: [{ name: 'Front office' }, { name: 'Housekeeping' }, { name: 'Food & beverage' }, { name: 'Kitchen' }, { name: 'Security' }, { name: 'Maintenance' }] };
    case 'logistics':
      return { name: 'HQ', children: [{ name: 'Warehouse' }, { name: 'Hub' }, { name: 'Fleet / drivers' }, { name: 'Delivery' }, { name: 'Operations' }] };
    case 'construction':
      return { name: 'Corporate HQ', children: [{ name: 'Project', children: [{ name: 'Site', children: [{ name: 'Contractor' }, { name: 'Worker' }] }] }] };
    case 'professional_services':
      return { name: 'Firm', children: [{ name: 'Client', children: [{ name: 'Project', children: [{ name: 'Assignment / billable hours' }] }] }] };
    case 'nonprofit':
      return { name: 'Organization', children: [{ name: 'Programs' }, { name: 'Grant-funded projects' }, { name: 'Field workers' }, { name: 'Volunteers' }] };
    case 'technology':
    default:
      return { name: 'Company', children: [{ name: 'Engineering' }, { name: 'Product' }, { name: 'Design' }, { name: 'QA' }, { name: 'DevOps' }, { name: 'Sales' }, { name: 'Customer success' }, { name: 'HR' }] };
  }
}

function fieldsFor(role: string): Record<FieldId, FieldAccess> {
  const open: Record<FieldId, FieldAccess> = {
    name: 'view',
    email: 'view',
    phone: 'view',
    department: 'view',
    designation: 'view',
    salary: 'hidden',
    bank: 'hidden',
    tax: 'hidden',
    performance: 'hidden',
    medical: 'hidden',
  };
  if (role === 'employee') return { ...open, name: 'edit', phone: 'edit', performance: 'view' };
  if (role === 'manager') return { ...open, performance: 'view', department: 'view' };
  if (role === 'hr' || role === 'hr_super') {
    return { ...open, salary: 'view', performance: 'edit', department: 'edit', designation: 'edit', phone: 'edit' };
  }
  if (role === 'payroll') {
    return { ...open, salary: 'edit', bank: 'edit', tax: 'edit', performance: 'hidden' };
  }
  if (role === 'finance') {
    return { ...open, salary: 'view', bank: 'view', tax: 'view', performance: 'hidden' };
  }
  if (role === 'recruiter') return { ...open, department: 'view' };
  if (role === 'store_manager') return { ...open, performance: 'view' };
  return { ...open, salary: 'edit', bank: 'edit', tax: 'edit', performance: 'edit', medical: 'view' };
}

export function defaultRoles(): AccessRole[] {
  const allLoc = { locations: ['*'], departments: ['*'], regions: ['*'], workerTypes: ['*'], entities: ['*'] };
  const mk = (id: string, name: string, description: string, modules: Record<string, string[]>): AccessRole => ({
    id,
    name,
    description,
    system: true,
    scope: { ...allLoc },
    modules,
    fields: fieldsFor(id),
  });
  return [
    mk('platform_owner', 'Platform owner', 'Tenant, billing, security, integrations, audit', { '*': ['*'] }),
    mk('org_admin', 'Organization admin', 'Entities, locations, policies, users, modules', { core_hr: ['manage'], compliance: ['manage'] }),
    mk('hr_super', 'HR super admin', 'All HR', { '*': ['manage'] }),
    mk('hr', 'HR manager', 'Employees, recruitment, leave, performance, reports', {
      core_hr: ['view', 'edit'],
      recruitment: ['manage'],
      leave: ['approve'],
      performance: ['manage'],
      payroll: ['view'],
    }),
    mk('hr_exec', 'HR executive', 'Limited operational HR', { core_hr: ['view'], leave: ['view'], recruitment: ['view'] }),
    mk('recruiter', 'Recruiter', 'Candidates, jobs, interviews, offers', { recruitment: ['manage'] }),
    mk('hiring_manager', 'Hiring manager', 'Own requisitions and interviews', { recruitment: ['view', 'interview'] }),
    mk('payroll', 'Payroll admin', 'Payroll, tax, loans, payslips', { payroll: ['manage'], expenses: ['view'] }),
    mk('attendance_admin', 'Attendance admin', 'Attendance, shifts, roster, overtime', { attendance: ['manage'], shifts: ['manage'] }),
    mk('finance', 'Finance', 'Expenses, payroll reports, cost', { expenses: ['manage'], payroll: ['view'] }),
    mk('manager', 'Manager', 'Direct reports: leave, attendance, goals, performance', {
      leave: ['approve'],
      attendance: ['view'],
      performance: ['view'],
      goals: ['edit'],
    }),
    mk('employee', 'Employee', 'Own profile, attendance, leave, payslip, expenses, goals', {
      core_hr: ['self'],
      leave: ['request'],
      attendance: ['self'],
      payroll: ['self'],
      expenses: ['request'],
      performance: ['self'],
    }),
    mk('store_manager', 'Store manager', 'One store: attendance, leave, shift swap — no payroll', {
      attendance: ['view', 'approve'],
      leave: ['approve'],
      shifts: ['manage'],
      performance: ['view'],
    }),
  ];
}

export function defaultPolicies(industry: Industry, country = 'India'): PolicyRule[] {
  const rules: PolicyRule[] = [
    {
      id: 'leave-ft-in',
      name: 'Annual leave · India full-time',
      kind: 'leave',
      layer: 'country',
      when: [
        { field: 'country', op: 'eq', value: country },
        { field: 'employmentType', op: 'eq', value: 'Full-time' },
        { field: 'tenureMonths', op: 'gt', value: 6 },
      ],
      then: '18 days / year',
    },
    {
      id: 'leave-short',
      name: 'Leave approval · short',
      kind: 'approval',
      layer: 'global',
      when: [{ field: 'leaveDays', op: 'gt', value: 0 }],
      then: '≤2 days → manager',
    },
    {
      id: 'leave-mid',
      name: 'Leave approval · medium',
      kind: 'approval',
      layer: 'global',
      when: [{ field: 'leaveDays', op: 'gt', value: 2 }],
      then: '3–7 days → manager + HR',
    },
    {
      id: 'leave-long',
      name: 'Leave approval · long',
      kind: 'approval',
      layer: 'global',
      when: [{ field: 'leaveDays', op: 'gt', value: 7 }],
      then: '>7 days → manager + HR + department head',
    },
    {
      id: 'expense-sales',
      name: 'Travel cap · sales · tier 1',
      kind: 'expense',
      layer: 'job',
      when: [
        { field: 'role', op: 'eq', value: 'Sales' },
        { field: 'expenseType', op: 'eq', value: 'Travel' },
        { field: 'locationTier', op: 'eq', value: '1' },
      ],
      then: 'Maximum ₹4,000 / day',
    },
  ];
  if (industry === 'manufacturing' || industry === 'hospitality' || industry === 'logistics') {
    rules.push({
      id: 'ot-night',
      name: 'Night allowance',
      kind: 'overtime',
      layer: 'location',
      when: [
        { field: 'state', op: 'eq', value: 'Karnataka' },
        { field: 'workerType', op: 'eq', value: 'Factory' },
        { field: 'shift', op: 'eq', value: 'Night' },
      ],
      then: 'Apply night allowance → payroll',
    });
  }
  return rules;
}

export function defaultApprovals(): ApprovalRule[] {
  return [
    {
      id: 'leave',
      trigger: 'Leave request',
      bands: [
        { when: 'days < 2', approvers: ['Manager'] },
        { when: 'days 3–7', approvers: ['Manager', 'HR'] },
        { when: 'days > 7', approvers: ['Manager', 'HR', 'Department head'] },
      ],
    },
    {
      id: 'salary',
      trigger: 'Salary revision',
      bands: [
        { when: 'any', approvers: ['Manager', 'HR', 'Finance'] },
        { when: 'amount > ₹X', approvers: ['Department head', 'CEO', 'Payroll'] },
      ],
    },
  ];
}

export function proposeBlueprint(answers: CompanyAnswers): GeneratedConfig {
  const wanted = new Set(BY_INDUSTRY[answers.industry] || BY_INDUSTRY.other);
  if (answers.contractors) wanted.add('contractors');
  if (answers.licensedProfessionals) {
    wanted.add('credentials');
    wanted.add('learning');
  }
  if (answers.shifts) {
    wanted.add('shifts');
    wanted.add('overtime');
  }
  if (answers.seasonal) wanted.add('seasonal');
  if (answers.workModel === 'remote' || answers.workModel === 'hybrid') wanted.add('assets');
  if (editionFor(answers.sizeBand) !== 'simple') wanted.add('workforce_planning');

  const modules = MODULE_REGISTRY.map((m) => {
    const industryOk = !m.industries || m.industries.includes(answers.industry);
    const proposed = wanted.has(m.id) && industryOk;
    const available = m.availability !== 'industry-only' || industryOk;
    return {
      id: m.id,
      state: (!available ? 'disabled' : proposed ? 'enabled' : 'disabled') as ModuleState,
      scope: answers.multiCountry ? 'Multi-country' : answers.countries[0] || 'India',
    };
  });

  const workerTypes: WorkerType[] = ['Full-time', 'Part-time', 'Intern'];
  if (answers.contractors) workerTypes.push('Contractor', 'Agency worker');
  if (answers.seasonal) workerTypes.push('Seasonal', 'Temporary');
  if (answers.industry === 'nonprofit') workerTypes.push('Volunteer');
  if (answers.industry === 'professional_services') workerTypes.push('Consultant', 'Freelancer');

  const roles = defaultRoles();
  if (answers.industry === 'retail') {
    roles.find((r) => r.id === 'store_manager')!.scope.locations = ['Store #104'];
  }

  return {
    answers,
    edition: editionFor(answers.sizeBand),
    modules,
    orgModel: orgModelFor(answers.industry),
    workerTypes,
    roles,
    policies: defaultPolicies(answers.industry, answers.countries[0] || 'India'),
    approvals: defaultApprovals(),
    relationships: ['Line manager', 'Project manager', 'Functional manager', 'Mentor', 'HR business partner'],
  };
}

export const DEMO_ANSWERS: CompanyAnswers = {
  name: 'OptiTalent Demo',
  industry: 'technology',
  sizeBand: '26-100',
  countries: ['India'],
  states: ['Karnataka'],
  entities: 1,
  locations: 2,
  workModel: 'hybrid',
  workforceMix: 'white-collar',
  payroll: 'monthly',
  contractors: false,
  licensedProfessionals: false,
  shifts: false,
  seasonal: false,
  multiCountry: false,
};

export function isModuleEnabled(config: GeneratedConfig | undefined, moduleId: string): boolean {
  if (!config) return true;
  return config.modules.find((m) => m.id === moduleId)?.state === 'enabled';
}

export function navFeatureEnabled(config: GeneratedConfig | undefined, featureId: string): boolean {
  if (!config) return true;
  const mods = MODULE_REGISTRY.filter((m) => m.navFeature === featureId);
  if (!mods.length) return true;
  return mods.some((m) => isModuleEnabled(config, m.id));
}

export type ActorContext = {
  roleId: string;
  location?: string;
  department?: string;
  region?: string;
};

export function fieldAccess(config: GeneratedConfig | undefined, actor: ActorContext, field: FieldId): FieldAccess {
  const role = config?.roles.find((r) => r.id === actor.roleId) || config?.roles.find((r) => r.id === mapLegacyRole(actor.roleId));
  if (!role) {
    if (['hr', 'admin'].includes(actor.roleId)) return field === 'medical' ? 'view' : 'view';
    if (actor.roleId === 'payroll' || actor.roleId === 'finance') return ['salary', 'bank', 'tax'].includes(field) ? 'view' : 'hidden';
    return ['salary', 'bank', 'tax', 'medical'].includes(field) ? 'hidden' : 'view';
  }
  return role.fields[field];
}

export function canAct(
  config: GeneratedConfig | undefined,
  actor: ActorContext,
  moduleId: string,
  action: string,
  subject?: { location?: string; department?: string }
): boolean {
  const role = config?.roles.find((r) => r.id === actor.roleId || r.id === mapLegacyRole(actor.roleId));
  if (!role) return ['admin', 'hr'].includes(actor.roleId);
  if (role.modules['*']?.includes('*') || role.modules['*']?.includes('manage')) return true;
  const acts = role.modules[moduleId] || [];
  const allowed = acts.includes('*') || acts.includes('manage') || acts.includes(action) || acts.includes('self');
  if (!allowed) return false;
  if (subject?.location && role.scope.locations[0] !== '*' && !role.scope.locations.includes(subject.location)) return false;
  if (subject?.department && role.scope.departments[0] !== '*' && !role.scope.departments.includes(subject.department)) return false;
  return true;
}

export function mapLegacyRole(role: string): string {
  if (role === 'admin') return 'org_admin';
  if (role === 'hr') return 'hr';
  if (role === 'manager' || role === 'team-leader') return 'manager';
  if (role === 'recruiter') return 'recruiter';
  if (role === 'finance') return 'finance';
  return 'employee';
}

export function flattenOrg(node: OrgNode, depth = 0): { name: string; depth: number }[] {
  return [{ name: node.name, depth }, ...(node.children || []).flatMap((c) => flattenOrg(c, depth + 1))];
}
