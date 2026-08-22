/**
 * OptiTalent HRMS dataquery layer.
 *
 * Single source of truth for all HR modules. Tries Supabase when credentials
 * are configured, otherwise uses a seeded, localStorage-persisted store so
 * every feature works in demo / local / Cloud Agent environments.
 */

import { mockUsers, type User, type UserProfile } from '@/lib/mock-data/employees';
import { courses as mockCourses } from '@/lib/mock-data/learning';
import { onboardingCandidates as mockOnboarding } from '@/lib/mock-data/onboarding';
import { shifts as mockShifts } from '@/lib/mock-data/shifts';
import { supabase } from '@/lib/supabase';

export const DATAQUERY_VERSION = 3;
export const DATAQUERY_STORAGE_KEY = 'optitalent_hrms_dataquery_v3';
export const DEMO_PASSWORD = 'password123';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const iso = (d = new Date()) => d.toISOString();
const ymd = (d = new Date()) => d.toISOString().slice(0, 10);

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export type LeaveType = 'Sick Leave' | 'Casual Leave' | 'Paid Time Off' | 'Work From Home';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type TicketStatus = 'Open' | 'In Progress' | 'Closed';
export type TicketPriority = 'High' | 'Medium' | 'Low';
export type TicketCategory = 'IT Support' | 'HR Query' | 'Payroll Issue' | 'Facilities' | 'General Inquiry';
export type ApplicantStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Week Off' | 'Holiday' | 'Work From Home';
export type ExpenseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Reimbursed';
export type AssetStatus = 'Assigned' | 'Available' | 'In Repair' | 'Retired';
export type OffboardingStatus = 'Initiated' | 'In Progress' | 'Clearance Pending' | 'Completed';
export type ApprovalKind = 'Leave' | 'Expense' | 'Timesheet' | 'Offer' | 'Asset';
export type GoalStatus = 'On track' | 'At risk' | 'Done';

export type ApprovalRecord = {
  id: string;
  kind: ApprovalKind;
  title: string;
  requester: string;
  status: LeaveStatus;
  created_at: string;
  ref_id: string;
};

export type GoalRecord = {
  id: string;
  owner: string;
  owner_id: string;
  title: string;
  key_result: string;
  progress: number;
  status: GoalStatus;
  cycle: string;
};

export type CompensationBand = {
  id: string;
  role: string;
  level: string;
  location: string;
  min: number;
  mid: number;
  max: number;
  currency: string;
};

export type BenefitPlan = {
  id: string;
  name: string;
  type: 'Health' | 'Retirement' | 'Insurance' | 'Wellness';
  coverage: string;
  enrolled: boolean;
};

export type SurveyRecord = {
  id: string;
  title: string;
  audience: string;
  status: 'Open' | 'Closed' | 'Draft';
  responses: number;
  score?: number;
};

export type SkillRecord = {
  id: string;
  employee_id: string;
  name: string;
  proficiency: number;
  category: string;
};

export type JourneyEvent = {
  id: string;
  employee_id: string;
  at: string;
  kind: string;
  title: string;
  detail: string;
};

export type OpportunityRecord = {
  id: string;
  title: string;
  kind: 'Project' | 'Assignment' | 'Mentoring' | 'Training' | 'Open role' | 'Leadership';
  skills: string[];
  owner: string;
  seats: number;
};

export type WorkflowRecipe = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  installed: boolean;
};

export type PolicyDoc = {
  id: string;
  title: string;
  body: string;
  executable: boolean;
};

export type ComplianceItem = {
  id: string;
  statute: string;
  jurisdiction: string;
  status: 'Healthy' | 'Watch' | 'Action';
  note: string;
  payroll_impact: string;
};

export type AgentRun = {
  id: string;
  at: string;
  actor: string;
  prompt: string;
  summary: string;
  actions: string[];
};

export type LeaveRequestRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  created_at: string;
};

export type TicketMessage = { from: 'user' | 'support' | 'system'; text: string; time: string };
export type TicketRecord = {
  id: string;
  ticket_number: number;
  employee_id: string;
  employee_name: string;
  subject: string;
  department: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  lastUpdate: string;
  messages: TicketMessage[];
};

export type PayrollRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  pay_period: string;
  gross: number;
  deductions: number;
  net_salary: number;
  status: 'Paid' | 'Processing' | 'Draft';
};

export type ApplicantRecord = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  appliedDate: string;
  status: ApplicantStatus;
  source: string;
};

export type JobRecord = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Open' | 'Closed' | 'Draft';
  openings: number;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  clock_in?: string;
  clock_out?: string;
  location: 'Office' | 'Home';
  shiftDetails?: string;
};

export type PerformanceReviewRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  reviewer: string;
  period: string;
  rating: string;
  goals: string;
  summary: string;
  created_at: string;
};

export type CourseRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  dueDate: string;
  imageUrl: string;
};

export type EnrollmentRecord = {
  id: string;
  courseId: string;
  employeeId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
};

export type FeedPostRecord = {
  id: string;
  author: string;
  authorRole: string;
  authorId: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
};

export type ExpenseRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: ExpenseStatus;
};

export type AssetRecord = {
  id: string;
  name: string;
  type: string;
  serial: string;
  assigned_to?: string;
  assigned_name?: string;
  status: AssetStatus;
  assigned_on?: string;
};

export type TimesheetRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  project: string;
  date: string;
  hours: number;
  billable: boolean;
  notes: string;
  status: 'Draft' | 'Submitted' | 'Approved';
};

export type HolidayRecord = {
  id: string;
  name: string;
  date: string;
  type: 'Public' | 'Optional' | 'Company';
};

export type OffboardingRecord = {
  id: string;
  employee_id: string;
  employee_name: string;
  last_working_day: string;
  reason: string;
  status: OffboardingStatus;
  checklist: { item: string; done: boolean }[];
};

export type KudosRecord = {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
};

export type HrmsDatabase = {
  version: number;
  employees: User[];
  leaveRequests: LeaveRequestRecord[];
  tickets: TicketRecord[];
  payroll: PayrollRecord[];
  applicants: ApplicantRecord[];
  jobs: JobRecord[];
  attendance: AttendanceRecord[];
  reviews: PerformanceReviewRecord[];
  courses: CourseRecord[];
  enrollments: EnrollmentRecord[];
  feed: FeedPostRecord[];
  expenses: ExpenseRecord[];
  assets: AssetRecord[];
  timesheets: TimesheetRecord[];
  holidays: HolidayRecord[];
  offboarding: OffboardingRecord[];
  kudos: KudosRecord[];
  shifts: typeof mockShifts;
  onboarding: typeof mockOnboarding;
  approvals: ApprovalRecord[];
  goals: GoalRecord[];
  compensation: CompensationBand[];
  benefits: BenefitPlan[];
  surveys: SurveyRecord[];
  skills: SkillRecord[];
  journeyEvents: JourneyEvent[];
  opportunities: OpportunityRecord[];
  workflowRecipes: WorkflowRecipe[];
  policies: PolicyDoc[];
  complianceItems: ComplianceItem[];
  agentRuns: AgentRun[];
};

function dayCount(from: string, to: string) {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.max(1, Math.ceil((b - a) / 86400000) + 1);
}

function seedAttendance(employees: User[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  for (const emp of employees) {
    for (let i = 1; i <= 22; i++) {
      const d = daysAgo(i);
      const dow = d.getDay();
      const date = ymd(d);
      if (dow === 0 || dow === 6) {
        records.push({
          id: uid(),
          employee_id: emp.profile.id,
          date,
          status: 'Week Off',
          location: 'Home',
          shiftDetails: 'Weekend',
        });
        continue;
      }
      if (i === 10 && emp.profile.employee_id === 'PEP0012') {
        records.push({
          id: uid(),
          employee_id: emp.profile.id,
          date,
          status: 'Leave',
          location: 'Home',
          shiftDetails: 'Sick Leave',
        });
        continue;
      }
      records.push({
        id: uid(),
        employee_id: emp.profile.id,
        date,
        status: 'Present',
        clock_in: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 8).toISOString(),
        clock_out: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 18, 12).toISOString(),
        location: 'Office',
        shiftDetails: 'General 09:00 - 18:00',
      });
    }
  }
  void today;
  return records;
}

function skillsForRole(title: string): { name: string; proficiency: number; category: string }[] {
  const t = title.toLowerCase();
  if (t.includes('devops')) {
    return [
      { name: 'AWS', proficiency: 70, category: 'Cloud' },
      { name: 'Docker', proficiency: 55, category: 'Platform' },
      { name: 'Kubernetes', proficiency: 30, category: 'Platform' },
      { name: 'Terraform', proficiency: 35, category: 'Platform' },
    ];
  }
  if (t.includes('software') || t.includes('engineer') || t.includes('frontend') || t.includes('backend')) {
    return [
      { name: 'JavaScript', proficiency: 82, category: 'Language' },
      { name: 'React', proficiency: 78, category: 'Frontend' },
      { name: 'SQL', proficiency: 64, category: 'Data' },
      { name: 'AWS', proficiency: 38, category: 'Cloud' },
    ];
  }
  if (t.includes('qa')) {
    return [
      { name: 'Test design', proficiency: 80, category: 'QA' },
      { name: 'Selenium', proficiency: 55, category: 'QA' },
      { name: 'SQL', proficiency: 50, category: 'Data' },
    ];
  }
  if (t.includes('hr') || t.includes('talent') || t.includes('recruiter')) {
    return [
      { name: 'Workforce planning', proficiency: 72, category: 'HR' },
      { name: 'Interviewing', proficiency: 80, category: 'HR' },
      { name: 'Indian labour compliance', proficiency: 68, category: 'HR' },
    ];
  }
  if (t.includes('finance') || t.includes('payroll')) {
    return [
      { name: 'Payroll accounting', proficiency: 75, category: 'Finance' },
      { name: 'TDS', proficiency: 70, category: 'Compliance' },
    ];
  }
  return [
    { name: 'Communication', proficiency: 70, category: 'Core' },
    { name: 'Domain knowledge', proficiency: 65, category: 'Core' },
  ];
}

function seedSkills(employees: User[]): SkillRecord[] {
  return employees.flatMap((emp) =>
    skillsForRole(emp.profile.job_title).map((s) => ({
      id: uid(),
      employee_id: emp.profile.id,
      ...s,
    }))
  );
}

function seedJourney(employees: User[]): JourneyEvent[] {
  const events: JourneyEvent[] = [];
  for (const emp of employees) {
    events.push({
      id: uid(),
      employee_id: emp.profile.id,
      at: emp.profile.hire_date || '2023-04-12',
      kind: 'Hire',
      title: 'Joined OptiTalent',
      detail: `${emp.profile.job_title} · ${emp.profile.department.name}`,
    });
    events.push({
      id: uid(),
      employee_id: emp.profile.id,
      at: '2024-04-01',
      kind: 'Review',
      title: 'Annual performance cycle',
      detail: 'Goals locked and 360 requested',
    });
  }
  const anika = employees.find((e) => e.profile.employee_id === 'PEP0012');
  if (anika) {
    events.push({
      id: uid(),
      employee_id: anika.profile.id,
      at: '2025-11-12',
      kind: 'Promotion wait',
      title: 'Promotion packet opened',
      detail: 'L3 → L4 discussion started; no decision recorded',
    });
  }
  return events.sort((a, b) => a.at.localeCompare(b.at));
}

export function createSeed(): HrmsDatabase {
  const employees: User[] = [
    {
      id: 'user-000',
      email: 'superadmin@optitalent.com',
      role: 'admin',
      profile: {
        id: 'profile-000',
        full_name: 'Platform Super Admin',
        department: { name: 'Platform' },
        department_id: 'd-000',
        job_title: 'Super Admin',
        role: 'admin',
        employee_id: 'PEP0000',
        email: 'superadmin@optitalent.com',
        phone_number: '000-000-0000',
        status: 'Active',
        hire_date: '2022-01-01',
        profile_picture_url: 'https://ui-avatars.com/api/?name=Super+Admin&background=random',
      },
    },
    ...mockUsers.map((u) => ({
      ...u,
      profile: {
        ...u.profile,
        email: u.email,
        hire_date: u.profile.hire_date || '2023-04-12',
      },
    })),
  ];

  const anika = employees.find((e) => e.profile.employee_id === 'PEP0012')!;
  const rohan = employees.find((e) => e.profile.employee_id === 'PEP0013')!;
  const jackson = employees.find((e) => e.profile.employee_id === 'PEP0002')!;
  const isabella = employees.find((e) => e.profile.employee_id === 'PEP0003')!;

  const courses: CourseRecord[] = mockCourses.map((c) => ({
    id: c.id,
    title: c.title,
    description: `${c.category} course · ${c.duration} hours`,
    category: c.category,
    duration: c.duration,
    dueDate: c.dueDate,
    imageUrl: c.imageUrl || 'https://placehold.co/600x400.png',
  }));

  const enrollments: EnrollmentRecord[] = employees.flatMap((emp, idx) =>
    courses.slice(0, 3).map((c, i) => ({
      id: uid(),
      courseId: c.id,
      employeeId: emp.profile.id,
      status: (i + idx) % 3 === 0 ? 'Completed' : (i + idx) % 3 === 1 ? 'In Progress' : 'Not Started',
      progress: (i + idx) % 3 === 0 ? 100 : (i + idx) % 3 === 1 ? 45 : 0,
    }))
  );

  return {
    version: DATAQUERY_VERSION,
    employees,
    leaveRequests: [
      {
        id: uid(),
        employee_id: anika.profile.id,
        employee_name: anika.profile.full_name,
        leave_type: 'Sick Leave',
        start_date: ymd(daysAgo(10)),
        end_date: ymd(daysAgo(9)),
        days: 2,
        reason: 'Fever and recovery',
        status: 'Approved',
        created_at: iso(daysAgo(12)),
      },
      {
        id: uid(),
        employee_id: anika.profile.id,
        employee_name: anika.profile.full_name,
        leave_type: 'Casual Leave',
        start_date: ymd(daysAgo(-5)),
        end_date: ymd(daysAgo(-5)),
        days: 1,
        reason: 'Family function',
        status: 'Pending',
        created_at: iso(),
      },
      {
        id: uid(),
        employee_id: rohan.profile.id,
        employee_name: rohan.profile.full_name,
        leave_type: 'Paid Time Off',
        start_date: ymd(daysAgo(-12)),
        end_date: ymd(daysAgo(-8)),
        days: 5,
        reason: 'Vacation',
        status: 'Pending',
        created_at: iso(daysAgo(1)),
      },
    ],
    tickets: [
      {
        id: uid(),
        ticket_number: 1042,
        employee_id: anika.profile.id,
        employee_name: anika.profile.full_name,
        subject: 'Laptop charger not working',
        department: 'IT Support',
        status: 'In Progress',
        priority: 'High',
        lastUpdate: new Date().toLocaleString(),
        messages: [
          { from: 'user', text: 'My charger stopped working this morning.', time: '09:12' },
          { from: 'support', text: 'We have dispatched a spare from IT inventory.', time: '09:40' },
        ],
      },
      {
        id: uid(),
        ticket_number: 1043,
        employee_id: rohan.profile.id,
        employee_name: rohan.profile.full_name,
        subject: 'PF statement for FY 25-26',
        department: 'Payroll Issue',
        status: 'Open',
        priority: 'Medium',
        lastUpdate: new Date().toLocaleString(),
        messages: [{ from: 'user', text: 'Please share the latest PF statement.', time: '11:02' }],
      },
    ],
    payroll: employees.map((emp, i) => {
      const gross = 4200 + (i % 6) * 350;
      const deductions = Math.round(gross * 0.18);
      return {
        id: uid(),
        employee_id: emp.profile.id,
        employee_name: emp.profile.full_name,
        pay_period: '2026-07-31',
        gross,
        deductions,
        net_salary: gross - deductions,
        status: 'Paid' as const,
      };
    }).concat(
      employees.map((emp, i) => {
        const gross = 4100 + (i % 6) * 350;
        const deductions = Math.round(gross * 0.18);
        return {
          id: uid(),
          employee_id: emp.profile.id,
          employee_name: emp.profile.full_name,
          pay_period: '2026-06-30',
          gross,
          deductions,
          net_salary: gross - deductions,
          status: 'Paid' as const,
        };
      })
    ),
    applicants: [
      { id: 'app-001', name: 'Maya Patel', email: 'maya.p@example.com', avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=random', role: 'Senior Engineer', appliedDate: ymd(daysAgo(4)), status: 'Interview', source: 'Careers page' },
      { id: 'app-002', name: 'Liam Chen', email: 'liam.c@example.com', avatar: 'https://ui-avatars.com/api/?name=Liam+Chen&background=random', role: 'Product Designer', appliedDate: ymd(daysAgo(6)), status: 'Screening', source: 'LinkedIn' },
      { id: 'app-003', name: 'Sara Ahmed', email: 'sara.a@example.com', avatar: 'https://ui-avatars.com/api/?name=Sara+Ahmed&background=random', role: 'HR Executive', appliedDate: ymd(daysAgo(2)), status: 'Applied', source: 'Walk-in drive' },
      { id: 'app-004', name: 'Noah Brooks', email: 'noah.b@example.com', avatar: 'https://ui-avatars.com/api/?name=Noah+Brooks&background=random', role: 'Support Specialist', appliedDate: ymd(daysAgo(12)), status: 'Offer', source: 'Referral' },
      { id: 'app-005', name: 'Priya Nair', email: 'priya.n@example.com', avatar: 'https://ui-avatars.com/api/?name=Priya+Nair&background=random', role: 'QA Engineer', appliedDate: ymd(daysAgo(18)), status: 'Hired', source: 'Naukri' },
    ],
    jobs: [
      { id: 'job-001', title: 'Senior Engineer', department: 'Engineering', location: 'Bengaluru / Hybrid', type: 'Full-time', status: 'Open', openings: 2, created_at: iso(daysAgo(20)) },
      { id: 'job-002', title: 'Customer Support Specialist', department: 'Customer Support', location: 'Remote', type: 'Full-time', status: 'Open', openings: 4, created_at: iso(daysAgo(10)) },
      { id: 'job-003', title: 'HR Business Partner', department: 'Human Resources', location: 'Bengaluru', type: 'Full-time', status: 'Open', openings: 1, created_at: iso(daysAgo(7)) },
    ],
    attendance: seedAttendance(employees),
    reviews: [
      {
        id: uid(),
        employee_id: anika.profile.id,
        employee_name: anika.profile.full_name,
        reviewer: isabella.profile.full_name,
        period: 'H1 2026',
        rating: 'Exceeds Expectations',
        goals: 'Ship payroll module, mentor 1 junior engineer',
        summary: 'Consistently delivered high-quality work and supported the team.',
        created_at: iso(daysAgo(30)),
      },
    ],
    courses,
    enrollments,
    feed: [
      {
        id: uid(),
        author: jackson.profile.full_name,
        authorRole: jackson.profile.job_title,
        authorId: jackson.profile.id,
        avatar: jackson.profile.profile_picture_url || '',
        title: 'Employee Referral Program is Active!',
        content: 'Refer a friend and earn bonus points when they complete 90 days.',
        timestamp: '1 week ago',
        likes: 24,
        comments: 6,
      },
      {
        id: uid(),
        author: isabella.profile.full_name,
        authorRole: isabella.profile.job_title,
        authorId: isabella.profile.id,
        avatar: isabella.profile.profile_picture_url || '',
        title: 'Q3 OKRs are live',
        content: 'Please complete goal setting in Performance by Friday.',
        timestamp: '3 days ago',
        likes: 11,
        comments: 2,
      },
    ],
    expenses: [
      { id: uid(), employee_id: anika.profile.id, employee_name: anika.profile.full_name, category: 'Travel', amount: 2450, date: ymd(daysAgo(3)), description: 'Client visit cab + metro', status: 'Submitted' },
      { id: uid(), employee_id: rohan.profile.id, employee_name: rohan.profile.full_name, category: 'Internet', amount: 999, date: ymd(daysAgo(8)), description: 'WFH broadband reimbursement', status: 'Approved' },
      { id: uid(), employee_id: anika.profile.id, employee_name: anika.profile.full_name, category: 'Meals', amount: 680, date: ymd(daysAgo(14)), description: 'Overtime dinner', status: 'Reimbursed' },
    ],
    assets: [
      { id: uid(), name: 'MacBook Pro 14"', type: 'Laptop', serial: 'MBP-88421', assigned_to: anika.profile.id, assigned_name: anika.profile.full_name, status: 'Assigned', assigned_on: '2024-02-01' },
      { id: uid(), name: 'ThinkPad T14', type: 'Laptop', serial: 'TP-55102', assigned_to: rohan.profile.id, assigned_name: rohan.profile.full_name, status: 'Assigned', assigned_on: '2024-06-12' },
      { id: uid(), name: 'Dell Monitor 27"', type: 'Monitor', serial: 'DL-27011', status: 'Available' },
      { id: uid(), name: 'iPhone 14', type: 'Phone', serial: 'IP-14002', status: 'In Repair' },
    ],
    timesheets: [
      { id: uid(), employee_id: anika.profile.id, employee_name: anika.profile.full_name, project: 'Payroll Engine', date: ymd(daysAgo(1)), hours: 8, billable: true, notes: 'Payslip PDF generation', status: 'Submitted' },
      { id: uid(), employee_id: anika.profile.id, employee_name: anika.profile.full_name, project: 'Internal HRMS', date: ymd(daysAgo(2)), hours: 7.5, billable: false, notes: 'Leave workflow', status: 'Approved' },
      { id: uid(), employee_id: rohan.profile.id, employee_name: rohan.profile.full_name, project: 'ATS Kanban', date: ymd(daysAgo(1)), hours: 6, billable: true, notes: 'Pipeline filters', status: 'Draft' },
    ],
    holidays: [
      { id: uid(), name: 'Republic Day', date: '2026-01-26', type: 'Public' },
      { id: uid(), name: 'Holi', date: '2026-03-04', type: 'Public' },
      { id: uid(), name: 'Independence Day', date: '2026-08-15', type: 'Public' },
      { id: uid(), name: 'Company Foundation Day', date: '2026-09-12', type: 'Company' },
      { id: uid(), name: 'Diwali', date: '2026-11-08', type: 'Public' },
    ],
    offboarding: [
      {
        id: uid(),
        employee_id: 'profile-exit-1',
        employee_name: 'Karan Singh',
        last_working_day: ymd(daysAgo(-14)),
        reason: 'Better opportunity',
        status: 'In Progress',
        checklist: [
          { item: 'Exit interview', done: true },
          { item: 'Asset return', done: false },
          { item: 'Access revocation', done: false },
          { item: 'Final settlement', done: false },
        ],
      },
    ],
    kudos: [
      { id: uid(), from: 'Anika Sharma', to: 'Rohan Verma', message: 'for helping with the critical deployment last night!', timestamp: '2 hours ago' },
      { id: uid(), from: 'Isabella Nguyen', to: 'Anika Sharma', message: 'for an outstanding stakeholder presentation.', timestamp: '1 day ago' },
    ],
    shifts: mockShifts,
    onboarding: mockOnboarding,
    approvals: [
      { id: uid(), kind: 'Leave', title: 'Casual leave · 1 day', requester: anika.profile.full_name, status: 'Pending', created_at: iso(), ref_id: 'leave' },
      { id: uid(), kind: 'Expense', title: 'Travel claim ₹2,450', requester: anika.profile.full_name, status: 'Pending', created_at: iso(daysAgo(1)), ref_id: 'exp' },
      { id: uid(), kind: 'Timesheet', title: 'Payroll Engine · 8h', requester: anika.profile.full_name, status: 'Pending', created_at: iso(daysAgo(1)), ref_id: 'ts' },
      { id: uid(), kind: 'Offer', title: 'Offer · Noah Brooks', requester: jackson.profile.full_name, status: 'Pending', created_at: iso(daysAgo(2)), ref_id: 'offer' },
    ],
    goals: [
      { id: uid(), owner: anika.profile.full_name, owner_id: anika.profile.id, title: 'Ship payslip PDF generation', key_result: '100% of July slips generated without manual edit', progress: 72, status: 'On track', cycle: 'Q3 2026' },
      { id: uid(), owner: rohan.profile.full_name, owner_id: rohan.profile.id, title: 'Cut ATS time-to-hire', key_result: 'Median time-to-hire under 21 days', progress: 40, status: 'At risk', cycle: 'Q3 2026' },
      { id: uid(), owner: isabella.profile.full_name, owner_id: isabella.profile.id, title: 'Engineering reliability', key_result: 'Zero Sev-1 incidents from HRMS payroll', progress: 88, status: 'On track', cycle: 'Q3 2026' },
    ],
    compensation: [
      { id: uid(), role: 'Software Engineer', level: 'L3', location: 'Bengaluru', min: 1400000, mid: 1800000, max: 2200000, currency: 'INR' },
      { id: uid(), role: 'Software Engineer', level: 'L4', location: 'Bengaluru', min: 2000000, mid: 2600000, max: 3200000, currency: 'INR' },
      { id: uid(), role: 'HR Business Partner', level: 'M1', location: 'Bengaluru', min: 1200000, mid: 1600000, max: 2000000, currency: 'INR' },
      { id: uid(), role: 'Support Specialist', level: 'L2', location: 'Remote', min: 600000, mid: 800000, max: 1000000, currency: 'INR' },
    ],
    benefits: [
      { id: uid(), name: 'Family floater health', type: 'Health', coverage: '₹5L sum insured', enrolled: true },
      { id: uid(), name: 'Provident fund', type: 'Retirement', coverage: '12% employer match', enrolled: true },
      { id: uid(), name: 'Term life', type: 'Insurance', coverage: '3× CTC', enrolled: true },
      { id: uid(), name: 'Mental health sessions', type: 'Wellness', coverage: '8 sessions / year', enrolled: false },
    ],
    surveys: [
      { id: uid(), title: 'Q3 engagement pulse', audience: 'All employees', status: 'Open', responses: 42, score: 7.4 },
      { id: uid(), title: 'Onboarding 30-day check', audience: 'New hires', status: 'Open', responses: 6, score: 8.1 },
      { id: uid(), title: 'Exit reasons 2026 H1', audience: 'Alumni', status: 'Closed', responses: 11, score: 6.2 },
    ],
    skills: seedSkills(employees),
    journeyEvents: seedJourney(employees),
    opportunities: [
      { id: uid(), title: 'Payroll reliability squad', kind: 'Project', skills: ['SQL', 'React'], owner: isabella.profile.full_name, seats: 2 },
      { id: uid(), title: 'Shadow DevOps onboarding week', kind: 'Assignment', skills: ['AWS', 'Docker'], owner: 'Platform', seats: 1 },
      { id: uid(), title: 'Mentor a trainee engineer', kind: 'Mentoring', skills: ['JavaScript', 'Communication'], owner: isabella.profile.full_name, seats: 4 },
      { id: uid(), title: 'AWS Practitioner cohort', kind: 'Training', skills: ['AWS'], owner: 'Learning', seats: 12 },
      { id: uid(), title: 'Open: DevOps Engineer', kind: 'Open role', skills: ['AWS', 'Kubernetes', 'Terraform'], owner: jackson.profile.full_name, seats: 1 },
      { id: uid(), title: 'People lead rotation', kind: 'Leadership', skills: ['Workforce planning'], owner: jackson.profile.full_name, seats: 1 },
    ],
    workflowRecipes: [
      {
        id: 'wf-new-hire',
        name: 'New employee',
        description: 'Record → documents → email → laptop → access → orientation',
        trigger: 'Candidate marked Hired',
        steps: ['Create employee', 'Request documents', 'IT account', 'Laptop', 'Orientation', 'Probation workflow'],
        installed: true,
      },
      {
        id: 'wf-promotion',
        name: 'Promotion',
        description: 'Manager request → performance → approval → salary → letter → payroll',
        trigger: 'Promotion request',
        steps: ['Performance check', 'Comp band check', 'Approvals', 'Letter', 'Payroll eligibility'],
        installed: true,
      },
      {
        id: 'wf-exit',
        name: 'Exit',
        description: 'Resignation → notice → assets → access → F&F → alumni',
        trigger: 'Resignation submitted',
        steps: ['Approve resignation', 'Notice period', 'Asset recovery', 'Revoke access', 'Settlement', 'Exit survey'],
        installed: true,
      },
    ],
    policies: [
      {
        id: 'pol-leave',
        title: 'Company Leave Policy.pdf',
        body: 'Casual leave 12 days. Sick leave 7 days. WFH up to 8 days per month for eligible roles after manager approval. Unused casual leave does not encash.',
        executable: true,
      },
      {
        id: 'pol-remote',
        title: 'Remote Work Policy.pdf',
        body: 'Engineering and Product may WFH if remaining monthly quota > 0 and the manager has not set a team office-only week. Support floor roles are office-first.',
        executable: true,
      },
      {
        id: 'pol-expense',
        title: 'Expense Policy.pdf',
        body: 'Internet reimbursement of ₹1,200/month for confirmed employees on hybrid/remote. Receipts required above ₹500. Travel requires pre-approval.',
        executable: true,
      },
      {
        id: 'pol-travel',
        title: 'Travel Policy.pdf',
        body: 'Domestic travel: manager + finance. International: HRBP + finance. Economy under 6 hours.',
        executable: true,
      },
    ],
    complianceItems: [
      { id: uid(), statute: 'PF', jurisdiction: 'India (EPFO)', status: 'Healthy', note: '12% employee + 12% employer on basic; challan window open', payroll_impact: 'Deduction + employer cost' },
      { id: uid(), statute: 'ESI', jurisdiction: 'India (ESIC)', status: 'Watch', note: 'Two employees near wage ceiling — confirm coverage next cycle', payroll_impact: '0.75% / 3.25% if covered' },
      { id: uid(), statute: 'PT', jurisdiction: 'Karnataka', status: 'Healthy', note: 'Profession tax slab applied on Bengaluru payroll', payroll_impact: 'State PT slab' },
      { id: uid(), statute: 'TDS', jurisdiction: 'India (IT Act)', status: 'Healthy', note: 'Form 16 pack staged for Q2', payroll_impact: 'Withholding' },
      { id: uid(), statute: 'LWF', jurisdiction: 'Karnataka', status: 'Watch', note: 'Half-yearly contribution due next month', payroll_impact: 'Nominal employee/employer' },
      { id: uid(), statute: 'Gratuity', jurisdiction: 'India', status: 'Healthy', note: 'Accrual running for staff past 4.5 years', payroll_impact: 'Provision' },
      { id: uid(), statute: 'Bonus Act', jurisdiction: 'India', status: 'Action', note: 'Eligible headcount not tagged for two trainees', payroll_impact: 'Annual bonus provision' },
      { id: uid(), statute: 'Working hours', jurisdiction: 'Shops & Establishments — KA', status: 'Watch', note: 'Engineering overtime last 6 weeks above weekly cap on 3 people', payroll_impact: 'OT payout + inspector risk' },
    ],
    agentRuns: [],
  };
}

let store: HrmsDatabase = createSeed();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DATAQUERY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota / private mode
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function hydrateDataQuery() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DATAQUERY_STORAGE_KEY);
    if (!raw) {
      store = createSeed();
      persist();
      return;
    }
    const parsed = JSON.parse(raw) as Partial<HrmsDatabase>;
    const seed = createSeed();
    store = { ...seed, ...parsed, version: DATAQUERY_VERSION };
    (Object.keys(seed) as (keyof HrmsDatabase)[]).forEach((key) => {
      if (store[key] == null) {
        (store as Record<string, unknown>)[key as string] = seed[key];
      }
    });
    if (!parsed.employees?.length) store.employees = seed.employees;
    if (!parsed.skills?.length) store.skills = seed.skills;
    if (!parsed.journeyEvents?.length) store.journeyEvents = seed.journeyEvents;
    if (!parsed.opportunities?.length) store.opportunities = seed.opportunities;
    if (!parsed.workflowRecipes?.length) store.workflowRecipes = seed.workflowRecipes;
    if (!parsed.policies?.length) store.policies = seed.policies;
    if (!parsed.complianceItems?.length) store.complianceItems = seed.complianceItems;
    if (!parsed.agentRuns) store.agentRuns = seed.agentRuns;
  } catch {
    store = createSeed();
  }
}

if (typeof window !== 'undefined') {
  hydrateDataQuery();
}

export function subscribeDataQuery(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDataQuerySnapshot(): HrmsDatabase {
  return store;
}

export function resetDataQuery() {
  store = createSeed();
  emit();
}

async function tryRemote<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fn();
  } catch (error) {
    console.warn('[dataquery] Supabase query failed, using local store', error);
    return null;
  }
}

export const dataQuery = {
  isSupabaseConfigured,
  getSnapshot: getDataQuerySnapshot,
  reset: resetDataQuery,

  listEmployees(): UserProfile[] {
    return store.employees.map((u) => u.profile);
  },

  getEmployeeById(idOrCode: string): UserProfile | undefined {
    return store.employees.find(
      (u) => u.profile.id === idOrCode || u.profile.employee_id === idOrCode || u.id === idOrCode
    )?.profile;
  },

  getUserByEmail(email: string): User | undefined {
    return store.employees.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  addEmployee(input: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    role: UserProfile['role'];
    phone?: string;
  }): User {
    const id = uid();
    const code = `PEP${String(store.employees.length + 1).padStart(4, '0')}`;
    const profile: UserProfile = {
      id: `profile-${id}`,
      full_name: input.name,
      department: { name: input.department },
      department_id: `d-${id.slice(0, 6)}`,
      job_title: input.jobTitle,
      role: input.role,
      employee_id: code,
      email: input.email,
      phone_number: input.phone || '',
      status: 'Active',
      hire_date: ymd(),
      profile_picture_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=random`,
    };
    const user: User = { id, email: input.email, role: input.role, profile };
    store = { ...store, employees: [user, ...store.employees] };
    emit();
    void tryRemote(async () => {
      await supabase.from('employees').insert({
        full_name: input.name,
        job_title: input.jobTitle,
        employee_id: code,
        phone_number: input.phone,
        status: 'Active',
      } as never);
      return true;
    });
    return user;
  },

  setEmployeeStatus(profileId: string, status: UserProfile['status']) {
    store = {
      ...store,
      employees: store.employees.map((u) =>
        u.profile.id === profileId || u.profile.employee_id === profileId
          ? { ...u, profile: { ...u.profile, status } }
          : u
      ),
    };
    emit();
  },

  listLeaveRequests(employeeId?: string): LeaveRequestRecord[] {
    const rows = store.leaveRequests;
    if (!employeeId) return rows;
    return rows.filter((r) => r.employee_id === employeeId);
  },

  applyLeave(input: {
    employee_id: string;
    employee_name: string;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    reason: string;
  }): LeaveRequestRecord {
    const rec: LeaveRequestRecord = {
      id: uid(),
      ...input,
      days: dayCount(input.start_date, input.end_date),
      status: 'Pending',
      created_at: iso(),
    };
    store = { ...store, leaveRequests: [rec, ...store.leaveRequests] };
    emit();
    void tryRemote(async () => {
      await supabase.from('leave_requests').insert({
        employee_id: input.employee_id,
        leave_type: input.leave_type,
        start_date: input.start_date,
        end_date: input.end_date,
        reason: input.reason,
        status: 'Pending',
      } as never);
      return true;
    });
    return rec;
  },

  updateLeaveStatus(id: string, status: LeaveStatus) {
    store = {
      ...store,
      leaveRequests: store.leaveRequests.map((r) => (r.id === id ? { ...r, status } : r)),
    };
    emit();
  },

  leaveBalances(employeeId: string) {
    const used = { 'Sick Leave': 0, 'Casual Leave': 0, 'Paid Time Off': 0 };
    for (const r of store.leaveRequests.filter((x) => x.employee_id === employeeId && x.status === 'Approved')) {
      if (r.leave_type in used) used[r.leave_type as keyof typeof used] += r.days;
    }
    return [
      { type: 'Sick Leave', total: 7, used: used['Sick Leave'], balance: 7 - used['Sick Leave'] },
      { type: 'Casual Leave', total: 12, used: used['Casual Leave'], balance: 12 - used['Casual Leave'] },
      { type: 'Paid Time Off', total: 20, used: used['Paid Time Off'], balance: 20 - used['Paid Time Off'] },
    ];
  },

  listTickets(): TicketRecord[] {
    return store.tickets;
  },

  createTicket(input: {
    employee_id: string;
    employee_name: string;
    subject: string;
    description: string;
    department: TicketCategory;
    priority: TicketPriority;
  }): TicketRecord {
    const rec: TicketRecord = {
      id: uid(),
      ticket_number: 1000 + store.tickets.length + 1,
      employee_id: input.employee_id,
      employee_name: input.employee_name,
      subject: input.subject,
      department: input.department,
      status: 'Open',
      priority: input.priority,
      lastUpdate: new Date().toLocaleString(),
      messages: [
        { from: 'system', text: `Ticket created · ${input.department} · ${input.priority}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { from: 'user', text: input.description, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ],
    };
    store = { ...store, tickets: [rec, ...store.tickets] };
    emit();
    return rec;
  },

  addTicketMessage(ticketId: string, from: TicketMessage['from'], text: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    store = {
      ...store,
      tickets: store.tickets.map((t) =>
        t.id === ticketId
          ? { ...t, lastUpdate: new Date().toLocaleString(), messages: [...t.messages, { from, text, time }] }
          : t
      ),
    };
    emit();
  },

  listPayroll(employeeId?: string): PayrollRecord[] {
    if (!employeeId) return store.payroll;
    return store.payroll.filter((p) => p.employee_id === employeeId);
  },

  listApplicants(): ApplicantRecord[] {
    return store.applicants;
  },

  addApplicant(input: Omit<ApplicantRecord, 'id' | 'appliedDate'> & { appliedDate?: string }): ApplicantRecord {
    const rec: ApplicantRecord = { ...input, id: uid(), appliedDate: input.appliedDate || ymd() };
    store = { ...store, applicants: [rec, ...store.applicants] };
    emit();
    return rec;
  },

  updateApplicantStatus(id: string, status: ApplicantStatus) {
    store = {
      ...store,
      applicants: store.applicants.map((a) => (a.id === id ? { ...a, status } : a)),
    };
    emit();
  },

  listJobs(): JobRecord[] {
    return store.jobs;
  },

  addJob(input: Omit<JobRecord, 'id' | 'created_at'>): JobRecord {
    const rec: JobRecord = { ...input, id: uid(), created_at: iso() };
    store = { ...store, jobs: [rec, ...store.jobs] };
    emit();
    return rec;
  },

  listAttendance(employeeId: string, from?: string, to?: string): AttendanceRecord[] {
    return store.attendance.filter((r) => {
      if (r.employee_id !== employeeId) return false;
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      return true;
    });
  },

  clock(employeeId: string): AttendanceRecord {
    const date = ymd();
    const existing = store.attendance.find((r) => r.employee_id === employeeId && r.date === date);
    const now = iso();
    if (existing) {
      const updated = { ...existing, clock_out: now, status: 'Present' as AttendanceStatus };
      store = {
        ...store,
        attendance: store.attendance.map((r) => (r.id === existing.id ? updated : r)),
      };
      emit();
      return updated;
    }
    const rec: AttendanceRecord = {
      id: uid(),
      employee_id: employeeId,
      date,
      status: 'Present',
      clock_in: now,
      location: 'Office',
      shiftDetails: 'General 09:00 - 18:00',
    };
    store = { ...store, attendance: [rec, ...store.attendance] };
    emit();
    return rec;
  },

  listReviews(): PerformanceReviewRecord[] {
    return store.reviews;
  },

  saveReview(input: Omit<PerformanceReviewRecord, 'id' | 'created_at'>): PerformanceReviewRecord {
    const rec: PerformanceReviewRecord = { ...input, id: uid(), created_at: iso() };
    store = { ...store, reviews: [rec, ...store.reviews] };
    emit();
    return rec;
  },

  listCourses(): CourseRecord[] {
    return store.courses;
  },

  listEnrollments(employeeId?: string): EnrollmentRecord[] {
    if (!employeeId) return store.enrollments;
    return store.enrollments.filter((e) => e.employeeId === employeeId);
  },

  updateEnrollmentProgress(id: string, progress: number) {
    store = {
      ...store,
      enrollments: store.enrollments.map((e) =>
        e.id === id
          ? {
              ...e,
              progress,
              status: progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started',
            }
          : e
      ),
    };
    emit();
  },

  listFeed(): FeedPostRecord[] {
    return store.feed;
  },

  addFeedPost(input: Omit<FeedPostRecord, 'id' | 'timestamp' | 'likes' | 'comments'>): FeedPostRecord {
    const rec: FeedPostRecord = { ...input, id: uid(), timestamp: 'Just now', likes: 0, comments: 0 };
    store = { ...store, feed: [rec, ...store.feed] };
    emit();
    return rec;
  },

  likeFeedPost(id: string) {
    store = {
      ...store,
      feed: store.feed.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)),
    };
    emit();
  },

  listExpenses(employeeId?: string): ExpenseRecord[] {
    if (!employeeId) return store.expenses;
    return store.expenses.filter((e) => e.employee_id === employeeId);
  },

  addExpense(input: Omit<ExpenseRecord, 'id' | 'status'> & { status?: ExpenseStatus }): ExpenseRecord {
    const rec: ExpenseRecord = { ...input, id: uid(), status: input.status || 'Submitted' };
    store = { ...store, expenses: [rec, ...store.expenses] };
    emit();
    return rec;
  },

  updateExpenseStatus(id: string, status: ExpenseStatus) {
    store = {
      ...store,
      expenses: store.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
    };
    emit();
  },

  listAssets(): AssetRecord[] {
    return store.assets;
  },

  assignAsset(id: string, employeeId: string, employeeName: string) {
    store = {
      ...store,
      assets: store.assets.map((a) =>
        a.id === id
          ? { ...a, assigned_to: employeeId, assigned_name: employeeName, status: 'Assigned', assigned_on: ymd() }
          : a
      ),
    };
    emit();
  },

  listTimesheets(employeeId?: string): TimesheetRecord[] {
    if (!employeeId) return store.timesheets;
    return store.timesheets.filter((t) => t.employee_id === employeeId);
  },

  addTimesheet(input: Omit<TimesheetRecord, 'id'>): TimesheetRecord {
    const rec: TimesheetRecord = { ...input, id: uid() };
    store = { ...store, timesheets: [rec, ...store.timesheets] };
    emit();
    return rec;
  },

  updateTimesheetStatus(id: string, status: TimesheetRecord['status']) {
    store = {
      ...store,
      timesheets: store.timesheets.map((t) => (t.id === id ? { ...t, status } : t)),
    };
    emit();
  },

  listHolidays(): HolidayRecord[] {
    return store.holidays;
  },

  listOffboarding(): OffboardingRecord[] {
    return store.offboarding;
  },

  addOffboarding(input: Omit<OffboardingRecord, 'id' | 'checklist' | 'status'>): OffboardingRecord {
    const rec: OffboardingRecord = {
      ...input,
      id: uid(),
      status: 'Initiated',
      checklist: [
        { item: 'Exit interview', done: false },
        { item: 'Asset return', done: false },
        { item: 'Access revocation', done: false },
        { item: 'Final settlement', done: false },
      ],
    };
    store = { ...store, offboarding: [rec, ...store.offboarding] };
    emit();
    return rec;
  },

  toggleOffboardingItem(id: string, item: string) {
    store = {
      ...store,
      offboarding: store.offboarding.map((o) =>
        o.id === id
          ? { ...o, checklist: o.checklist.map((c) => (c.item === item ? { ...c, done: !c.done } : c)) }
          : o
      ),
    };
    emit();
  },

  listKudos(): KudosRecord[] {
    return store.kudos;
  },

  addKudos(input: Omit<KudosRecord, 'id' | 'timestamp'>): KudosRecord {
    const rec: KudosRecord = { ...input, id: uid(), timestamp: 'Just now' };
    store = { ...store, kudos: [rec, ...store.kudos] };
    emit();
    return rec;
  },

  listApprovals(): ApprovalRecord[] {
    return store.approvals;
  },

  decideApproval(id: string, status: LeaveStatus) {
    store = {
      ...store,
      approvals: store.approvals.map((a) => (a.id === id ? { ...a, status } : a)),
    };
    emit();
  },

  listGoals(ownerId?: string): GoalRecord[] {
    if (!ownerId) return store.goals;
    return store.goals.filter((g) => g.owner_id === ownerId);
  },

  addGoal(input: Omit<GoalRecord, 'id'>): GoalRecord {
    const rec = { ...input, id: uid() };
    store = { ...store, goals: [rec, ...store.goals] };
    emit();
    return rec;
  },

  listCompensation(): CompensationBand[] {
    return store.compensation;
  },

  listBenefits(): BenefitPlan[] {
    return store.benefits;
  },

  toggleBenefit(id: string) {
    store = {
      ...store,
      benefits: store.benefits.map((b) => (b.id === id ? { ...b, enrolled: !b.enrolled } : b)),
    };
    emit();
  },

  listSurveys(): SurveyRecord[] {
    return store.surveys;
  },

  respondSurvey(id: string) {
    store = {
      ...store,
      surveys: store.surveys.map((s) =>
        s.id === id ? { ...s, responses: s.responses + 1 } : s
      ),
    };
    emit();
  },

  listSkills(employeeId?: string): SkillRecord[] {
    if (!employeeId) return store.skills || [];
    return (store.skills || []).filter((s) => s.employee_id === employeeId);
  },

  listJourney(employeeId?: string): JourneyEvent[] {
    const rows = store.journeyEvents || [];
    if (!employeeId) return rows;
    return rows.filter((e) => e.employee_id === employeeId);
  },

  addJourneyEvent(input: Omit<JourneyEvent, 'id'>): JourneyEvent {
    const rec: JourneyEvent = { ...input, id: uid() };
    store = { ...store, journeyEvents: [rec, ...(store.journeyEvents || [])] };
    emit();
    return rec;
  },

  listOpportunities(): OpportunityRecord[] {
    return store.opportunities || [];
  },

  listWorkflowRecipes(): WorkflowRecipe[] {
    return store.workflowRecipes || [];
  },

  toggleWorkflowInstall(id: string) {
    store = {
      ...store,
      workflowRecipes: (store.workflowRecipes || []).map((w) =>
        w.id === id ? { ...w, installed: !w.installed } : w
      ),
    };
    emit();
  },

  listPolicies(): PolicyDoc[] {
    return store.policies || [];
  },

  listCompliance(): ComplianceItem[] {
    return store.complianceItems || [];
  },

  listAgentRuns(): AgentRun[] {
    return store.agentRuns || [];
  },

  logAgentRun(input: Omit<AgentRun, 'id' | 'at'>): AgentRun {
    const rec: AgentRun = { ...input, id: uid(), at: iso() };
    store = { ...store, agentRuns: [rec, ...(store.agentRuns || [])] };
    emit();
    return rec;
  },

  addAsset(input: Omit<AssetRecord, 'id'>): AssetRecord {
    const rec: AssetRecord = { ...input, id: uid() };
    store = { ...store, assets: [rec, ...store.assets] };
    emit();
    return rec;
  },

  dashboardStats() {
    const employees = this.listEmployees();
    const pendingLeaves = store.leaveRequests.filter((r) => r.status === 'Pending').length;
    const openJobs = store.jobs.filter((j) => j.status === 'Open').length;
    const openTickets = store.tickets.filter((t) => t.status !== 'Closed').length;
    const pendingExpenses = store.expenses.filter((e) => e.status === 'Submitted').length;
    return {
      headcount: employees.filter((e) => e.status === 'Active').length,
      pendingLeaves,
      openJobs,
      openTickets,
      pendingExpenses,
      applicants: store.applicants.length,
      courses: store.courses.length,
      pendingApprovals: store.approvals.filter((a) => a.status === 'Pending').length,
    };
  },
};

export type DataQueryApi = typeof dataQuery;
