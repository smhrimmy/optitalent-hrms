/**
 * Workforce Intelligence OS — predict, explain, recommend, simulate, execute.
 * Decision support only: scores are not automated judgments about a person.
 */

import { dataQuery, type HrmsDatabase } from '@/lib/dataquery';
import type { UserProfile } from '@/lib/mock-data/employees';

export const TARGET_ROLES = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    skills: { JavaScript: 85, React: 85, SQL: 45, AWS: 25 },
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    skills: { AWS: 80, Docker: 75, Kubernetes: 70, Terraform: 65, JavaScript: 40 },
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    skills: { SQL: 80, AWS: 60, JavaScript: 70, React: 30 },
  },
  {
    id: 'hrbp',
    title: 'HR Business Partner',
    skills: { 'Workforce planning': 80, Interviewing: 75, 'Indian labour compliance': 80 },
  },
] as const;

export type TwinSignals = {
  performance: number;
  workload: number;
  overtime: number;
  learning: number;
  managerInteraction: number;
  promotionWait: number;
  salaryPosition: number;
  engagement: number;
};

export type EmployeeTwin = {
  id: string;
  employee_id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  skills: { name: string; proficiency: number; category: string }[];
  signals: TwinSignals;
  attritionRisk: number;
  primarySignals: string[];
  recommendedActions: string[];
  daysSince1on1: number;
  promotionOverdue: boolean;
};

export type OrgNode = {
  name: string;
  headcount: number;
  avgRisk: number;
  avgWorkload: number;
  people: EmployeeTwin[];
};

function ratingScore(rating: string) {
  const n = parseFloat(rating);
  if (!Number.isNaN(n)) return n;
  const key = rating.toLowerCase();
  if (key.includes('exceed')) return 88;
  if (key.includes('meet')) return 75;
  if (key.includes('need')) return 55;
  return 72;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

function seedBias(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function buildEmployeeTwin(profile: UserProfile, db: HrmsDatabase): EmployeeTwin {
  const skills = (db.skills || []).filter((s) => s.employee_id === profile.id);
  const enrollments = db.enrollments.filter((e) => e.employeeId === profile.id);
  const learning =
    enrollments.length === 0
      ? 40
      : enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length;
  const reviews = db.reviews.filter((r) => r.employee_id === profile.id);
  const performance = reviews.length
    ? reviews.reduce((a, r) => a + ratingScore(r.rating), 0) / reviews.length
    : 72;

  const hours = db.attendance
    .filter((a) => a.employee_id === profile.id && a.clock_in && a.clock_out)
    .map((a) => {
      const start = new Date(a.clock_in as string).getTime();
      const end = new Date(a.clock_out as string).getTime();
      return (end - start) / 36e5;
    });
  const avgHours = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : 8.5;
  const overtime = clamp((avgHours - 8) * 35);
  const workload = clamp(55 + overtime * 0.4 + (profile.department.name === 'Engineering' ? 12 : 0));

  const bias = seedBias(profile.id);
  const isAnika = profile.employee_id === 'PEP0012';
  const daysSince1on1 = isAnika ? 47 : 8 + (bias % 28);
  const managerInteraction = clamp(100 - daysSince1on1 * 1.6);
  const promotionWait = isAnika ? 82 : 20 + (bias % 40);
  const salaryPosition = isAnika ? 38 : 55 + (bias % 25);
  const engagement = isAnika ? 48 : clamp(78 - overtime * 0.15 + learning * 0.1);

  const signals: TwinSignals = {
    performance: clamp(isAnika ? 86 : performance),
    workload: clamp(isAnika ? 88 : workload),
    overtime: clamp(isAnika ? 84 : overtime),
    learning: clamp(isAnika ? 28 : learning),
    managerInteraction: clamp(isAnika ? 32 : managerInteraction),
    promotionWait: clamp(promotionWait),
    salaryPosition: clamp(salaryPosition),
    engagement: clamp(engagement),
  };

  const attritionRisk = clamp(
    signals.workload * 0.18 +
      signals.overtime * 0.12 +
      signals.promotionWait * 0.2 +
      (100 - signals.salaryPosition) * 0.18 +
      (100 - signals.engagement) * 0.16 +
      (100 - signals.managerInteraction) * 0.1 +
      (100 - signals.learning) * 0.06 -
      Math.max(0, signals.performance - 70) * 0.05
  );

  const primarySignals: string[] = [];
  if (signals.salaryPosition < 50) primarySignals.push('compensation compression');
  if (signals.workload > 75) primarySignals.push('workload increase');
  if (signals.promotionWait > 60) primarySignals.push('career progression stagnation');
  if (signals.engagement < 60) primarySignals.push('reduced engagement');
  if (daysSince1on1 > 30) primarySignals.push('manager 1:1 gap');
  if (signals.learning < 40) primarySignals.push('learning activity down');
  if (!primarySignals.length) primarySignals.push('no elevated people-risk signals');

  const recommendedActions: string[] = [];
  if (signals.promotionWait > 60) recommendedActions.push('Career discussion');
  if (signals.salaryPosition < 50) recommendedActions.push('Compensation review');
  if (signals.workload > 75) recommendedActions.push('Workload redistribution');
  if (signals.learning < 45) recommendedActions.push('Learning opportunity');
  if (daysSince1on1 > 21) recommendedActions.push('Schedule a 1:1');
  if (!recommendedActions.length) recommendedActions.push('Keep regular check-ins');

  return {
    id: profile.id,
    employee_id: profile.employee_id,
    name: profile.full_name,
    role: profile.job_title,
    department: profile.department.name,
    avatar: profile.profile_picture_url,
    skills,
    signals,
    attritionRisk,
    primarySignals,
    recommendedActions,
    daysSince1on1,
    promotionOverdue: promotionWait > 70,
  };
}

export function listTwins(db: HrmsDatabase = dataQuery.getSnapshot()): EmployeeTwin[] {
  return db.employees
    .filter((u) => u.profile.status === 'Active')
    .map((u) => buildEmployeeTwin(u.profile, db));
}

export function orgTree(twins: EmployeeTwin[]): OrgNode[] {
  const map = new Map<string, EmployeeTwin[]>();
  for (const t of twins) {
    const list = map.get(t.department) || [];
    list.push(t);
    map.set(t.department, list);
  }
  return [...map.entries()]
    .map(([name, people]) => ({
      name,
      headcount: people.length,
      avgRisk: clamp(people.reduce((a, p) => a + p.attritionRisk, 0) / people.length),
      avgWorkload: clamp(people.reduce((a, p) => a + p.signals.workload, 0) / people.length),
      people,
    }))
    .sort((a, b) => b.headcount - a.headcount);
}

export function commandCenter(db: HrmsDatabase = dataQuery.getSnapshot()) {
  const twins = listTwins(db);
  const highRisk = twins.filter((t) => t.attritionRisk >= 55);
  const highWorkload = orgTree(twins).filter((n) => n.avgWorkload >= 80);
  const stats = dataQuery.dashboardStats();
  const openRoles = db.jobs.filter((j) => j.status === 'Open').length;
  const payrollCost = db.payroll.reduce((a, p) => a + p.net_salary, 0);
  return {
    employees: stats.headcount,
    hiring: db.applicants.filter((a) => a.status !== 'Rejected' && a.status !== 'Hired').length,
    attrition: Number((highRisk.length / Math.max(1, twins.length) * 8.2).toFixed(1)),
    payroll: payrollCost,
    peopleCost: Math.round(payrollCost * 1.28),
    openRoles,
    criticalSkills: 17,
    highWorkloadTeams: highWorkload.map((t) => t.name),
    highRisk,
    twins,
  };
}

export type WhyResult = {
  metric: string;
  value: string;
  contributors: { label: string; share: number }[];
  interventions: { area: string; action: string }[];
};

export function whyEngine(metric: string, db: HrmsDatabase = dataQuery.getSnapshot()): WhyResult {
  const twins = listTwins(db);
  const tree = orgTree(twins);
  const key = metric.toLowerCase();

  if (key.includes('attrition') || key.includes('risk')) {
    const byDept = tree
      .map((n) => ({ label: n.name, share: n.avgRisk }))
      .sort((a, b) => b.share - a.share);
    const total = byDept.reduce((a, b) => a + b.share, 0) || 1;
    const contributors = [
      ...byDept.slice(0, 2).map((d) => ({
        label: d.label,
        share: Math.round((d.share / total) * 31),
      })),
      { label: 'Compensation gap', share: 22 },
      { label: 'Manager changes / 1:1 gaps', share: 17 },
      { label: 'Workload', share: 15 },
      { label: 'Career progression', share: 9 },
    ];
    return {
      metric: 'Attrition risk',
      value: `${(twins.filter((t) => t.attritionRisk >= 55).length / Math.max(1, twins.length) * 100).toFixed(1)}% of staff flagged for attention`,
      contributors,
      interventions: [
        { area: 'Engineering', action: 'Review workload and overtime on high-signal people' },
        { area: 'High-risk teams', action: 'Manager 1:1 program (cadence < 14 days)' },
        { area: 'Compensation', action: 'Identify salary compression vs published bands' },
        { area: 'Career', action: 'Launch internal mobility plans from the talent marketplace' },
      ],
    };
  }

  if (key.includes('headcount') || key.includes('hiring')) {
    return {
      metric: 'Hiring',
      value: `${db.jobs.filter((j) => j.status === 'Open').length} open roles · ${db.applicants.length} applicants`,
      contributors: [
        { label: 'Engineering reqs', share: 44 },
        { label: 'Backfill vs growth', share: 28 },
        { label: 'Time-to-hire drag', share: 18 },
        { label: 'Offer drop-off', share: 10 },
      ],
      interventions: [
        { area: 'Recruiting', action: 'Prioritize internal matches before external spend' },
        { area: 'Managers', action: 'Protect interview slots this week' },
      ],
    };
  }

  if (key.includes('attendance') || key.includes('overtime')) {
    return {
      metric: 'Attendance / overtime',
      value: `${tree.filter((t) => t.avgWorkload >= 80).length} teams above workload threshold`,
      contributors: [
        { label: 'Engineering hours', share: 41 },
        { label: 'Support coverage gaps', share: 27 },
        { label: 'Leave clustering', share: 20 },
        { label: 'Shift overflow', share: 12 },
      ],
      interventions: [
        { area: 'Ops', action: 'Redistribute shifts; cap consecutive long days' },
        { area: 'HR', action: 'Check Shops & Establishments overtime flags in Compliance IQ' },
      ],
    };
  }

  return {
    metric: 'Workforce',
    value: `${twins.length} active people`,
    contributors: tree.slice(0, 5).map((t) => ({ label: t.name, share: t.headcount })),
    interventions: [{ area: 'HR', action: 'Open People OS for the weekly briefing' }],
  };
}

export type HireSim = {
  hires: number;
  role: string;
  recruitmentCost: number;
  salaryCost: number;
  timelineWeeks: number;
  managerCapacity: string;
  onboardingCapacity: string;
  workspace: string;
  projectCapacity: string;
  revenueCapacity: string;
  bottleneck: string;
  extraManagers: number;
  formatted: Record<string, string>;
};

export function simulateHire(hires: number, role = 'Software Engineer', midCtc = 1800000): HireSim {
  const n = Math.max(0, Math.min(200, Math.round(hires)));
  const recruitmentCost = n * 85000;
  const salaryCost = n * midCtc;
  const timelineWeeks = n === 0 ? 0 : Math.max(4, Math.ceil(n / 3.5));
  const extraManagers = Math.max(0, Math.ceil(n / 8) - 1);
  const onboardSlotsPerWeek = 6;
  const onboardingOverflow = n > onboardSlotsPerWeek * 4;
  let bottleneck = 'None material';
  if (extraManagers > 0) bottleneck = 'Engineering Managers';
  if (onboardingOverflow) bottleneck = extraManagers > 0 ? 'Managers and onboarding desks' : 'Onboarding capacity';

  return {
    hires: n,
    role,
    recruitmentCost,
    salaryCost,
    timelineWeeks,
    managerCapacity: extraManagers > 0 ? `${extraManagers} additional managers recommended` : 'Current managers can absorb',
    onboardingCapacity: onboardingOverflow
      ? `Induction overflow — ${n} joiners vs ~${onboardSlotsPerWeek}/week desks`
      : 'Induction desks can absorb',
    workspace: `${n} seats / laptops / access packs`,
    projectCapacity: `~${Math.round(n * 0.7)} FTE productive after 8 weeks`,
    revenueCapacity: n ? `+${Math.round(n * 1.8)}% delivery capacity (directional)` : 'No change',
    bottleneck,
    extraManagers,
    formatted: {
      recruitmentCost: inr(recruitmentCost),
      salaryCost: inr(salaryCost),
      annualWorkforce: inr(salaryCost * 1.28),
    },
  };
}

export function simulateAttrition(pct: number, department?: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const twins = listTwins(db).filter((t) => !department || t.department === department);
  const n = Math.round(twins.length * (pct / 100));
  const lost = [...twins].sort((a, b) => b.attritionRisk - a.attritionRisk).slice(0, n);
  return {
    leavers: n,
    names: lost.map((l) => l.name),
    replacementCost: inr(n * 4.2 * 1800000 * 0.15),
    skillHoles: lost.flatMap((l) => l.skills.filter((s) => s.proficiency > 70).map((s) => s.name)).slice(0, 6),
    teamsHit: [...new Set(lost.map((l) => l.department))],
  };
}

export function peopleBrief(db: HrmsDatabase = dataQuery.getSnapshot()) {
  const cc = commandCenter(db);
  const stats = dataQuery.dashboardStats();
  const why = whyEngine('attrition', db);
  return {
    title: 'Weekly people brief',
    bullets: [
      `Headcount ${cc.employees} (active).`,
      `Hiring: ${stats.openJobs} open positions, ${cc.hiring} live candidates.`,
      `Attrition attention: ${cc.highRisk.length} people with elevated signals (decision support, not a verdict).`,
      `Attendance: ${cc.highWorkloadTeams.length ? cc.highWorkloadTeams.join(', ') : 'no'} teams above workload threshold.`,
      `Performance: ${db.goals.filter((g) => g.status === 'At risk').length} goals at risk; reviews still sit on the same employee graph.`,
      `Risk: ${cc.highWorkloadTeams[0] ? `${cc.highWorkloadTeams[0]} workload increasing` : 'stable load'}.`,
    ],
    recommended: why.interventions[0]?.action || 'Review staffing on the highest-workload team',
  };
}

export function workHealth(employeeId: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const emp = db.employees.find(
    (e) => e.profile.id === employeeId || e.profile.employee_id === employeeId
  );
  if (!emp) return null;
  const twin = buildEmployeeTwin(emp.profile, db);
  const s = twin.signals;
  return {
    twin,
    scores: {
      Workload: s.workload,
      Focus: clamp(100 - s.overtime * 0.4),
      'Leave usage': 42,
      Overtime: s.overtime,
      'Goal progress': clamp(db.goals.find((g) => g.owner_id === emp.profile.id)?.progress || 70),
      Learning: s.learning,
      Engagement: s.engagement,
      'Manager 1:1': s.managerInteraction,
    },
    note:
      s.workload > 70
        ? `Workload is ${s.workload}% of the local scale — up versus a calmer baseline. This is work health, not medical advice.`
        : 'Load looks sustainable on the signals we have. Keep the 1:1 cadence.',
  };
}

export function managerCopilot(managerName: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const twins = listTwins(db);
  const team =
    twins.filter((t) => t.department === 'Engineering' || t.role.toLowerCase().includes('engineer')).length > 3
      ? twins.filter((t) => t.department !== 'Platform' && t.department !== 'Administration')
      : twins;
  const avg = (key: keyof TwinSignals) =>
    clamp(team.reduce((a, t) => a + t.signals[key], 0) / Math.max(1, team.length));
  const items = [...team]
    .sort((a, b) => b.attritionRisk - a.attritionRisk)
    .slice(0, 3)
    .map((t) => {
      if (t.daysSince1on1 > 21) {
        return { person: t.name, detail: `No 1:1 for ${t.daysSince1on1} days`, risk: t.attritionRisk };
      }
      if (t.signals.workload > 80) {
        return {
          person: t.name,
          detail: `Workload ${t.signals.workload}% — above team average`,
          risk: t.attritionRisk,
        };
      }
      if (t.promotionOverdue) {
        return { person: t.name, detail: 'Promotion review overdue', risk: t.attritionRisk };
      }
      return { person: t.name, detail: t.primarySignals[0], risk: t.attritionRisk };
    });
  return {
    managerName,
    size: team.length,
    performance: avg('performance'),
    engagement: avg('engagement'),
    workload: avg('workload'),
    attritionRisk: clamp(team.reduce((a, t) => a + t.attritionRisk, 0) / Math.max(1, team.length)),
    items,
  };
}

export type SkillGap = { skill: string; current: number; target: number };

export function talentPath(employeeId: string, targetId: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const emp = db.employees.find(
    (e) => e.profile.id === employeeId || e.profile.employee_id === employeeId
  );
  const target = TARGET_ROLES.find((r) => r.id === targetId) || TARGET_ROLES[1];
  const have = new Map(
    (db.skills || [])
      .filter((s) => s.employee_id === emp?.profile.id)
      .map((s) => [s.name, s.proficiency])
  );
  const gaps: SkillGap[] = Object.entries(target.skills).map(([skill, targetScore]) => ({
    skill,
    current: have.get(skill) || 0,
    target: targetScore,
  }));
  const courses = db.courses.map((c) => c.title);
  const recs = gaps
    .filter((g) => g.current < g.target)
    .map((g) => {
      if (g.skill === 'AWS') return 'AWS course';
      if (g.skill === 'Docker') return 'Docker project';
      if (g.skill === 'Kubernetes') return 'Kubernetes internal assignment';
      return `${g.skill} practice`;
    });
  if (target.id === 'devops') recs.push('DevOps mentor');
  const internals = listTwins(db)
    .filter((t) => t.id !== emp?.profile.id)
    .map((t) => {
      const score = gaps.reduce((a, g) => {
        const s = t.skills.find((x) => x.name === g.skill)?.proficiency || 0;
        return a + Math.min(s, g.target);
      }, 0);
      return { name: t.name, role: t.role, score, department: t.department };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  return {
    current: emp?.profile.job_title || 'Unknown',
    target: target.title,
    gaps,
    recommended: recs,
    courses: courses.slice(0, 4),
    internals,
  };
}

export function matchOpportunities(employeeId: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const skills = new Set(
    (db.skills || []).filter((s) => s.employee_id === employeeId).map((s) => s.name)
  );
  return (db.opportunities || [])
    .map((o) => ({
      ...o,
      match: o.skills.filter((s) => skills.has(s)).length,
    }))
    .sort((a, b) => b.match - a.match);
}

export function interpretPolicy(question: string, employeeId?: string, db: HrmsDatabase = dataQuery.getSnapshot()) {
  const q = question.toLowerCase();
  const emp = employeeId
    ? db.employees.find((e) => e.profile.id === employeeId || e.profile.employee_id === employeeId)
    : undefined;
  const policies = db.policies || [];
  if (q.includes('internet') || q.includes('reimburse')) {
    const pol = policies.find((p) => p.id === 'pol-expense')!;
    const eligible = emp?.profile.status === 'Active';
    return {
      policy: pol.title,
      answer: eligible
        ? 'Yes — confirmed/active staff on hybrid or remote can claim internet reimbursement of ₹1,200/month under the expense policy. Receipts required above ₹500.'
        : 'Internet reimbursement is ₹1,200/month for confirmed hybrid/remote employees. Eligibility depends on employment status.',
      citation: pol.body,
    };
  }
  if (q.includes('wfh') || q.includes('work from home') || q.includes('remote')) {
    const pol = policies.find((p) => p.id === 'pol-remote')!;
    const floor = emp?.profile.job_title.toLowerCase().includes('support');
    return {
      policy: pol.title,
      answer: floor
        ? 'Support floor roles are office-first. WFH is exception-based after manager approval.'
        : 'Eligible if remaining monthly WFH quota is open and the team is not in an office-only week. The system would send this to the manager next.',
      citation: pol.body,
    };
  }
  if (q.includes('leave') || q.includes('casual') || q.includes('sick')) {
    const pol = policies.find((p) => p.id === 'pol-leave')!;
    return {
      policy: pol.title,
      answer: 'Casual leave 12 days, sick leave 7 days. WFH is a separate quota (8 days/month for eligible roles). Casual leave does not encash.',
      citation: pol.body,
    };
  }
  return {
    policy: 'HR knowledge brain',
    answer: 'I only answer from this company’s uploaded policies (leave, remote, expense, travel). Ask about WFH, internet reimbursement, or leave quotas.',
    citation: policies.map((p) => p.title).join(', '),
  };
}

export type AgentResult = {
  reply: string;
  actions: string[];
};

export function runWorkforceAgent(
  prompt: string,
  actor: { name: string; role: string; profileId: string; employeeId: string }
): AgentResult {
  const q = prompt.toLowerCase();
  const db = dataQuery.getSnapshot();
  const actions: string[] = [];

  if (/(onboard|joining monday|prepare everything|new frontend|new hire pack)/i.test(q)) {
    const nameMatch = prompt.match(/for ([A-Z][a-z]+ [A-Z][a-z]+)/);
    const name = nameMatch?.[1] || 'Priya Menon';
    const created = dataQuery.addEmployee({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@optitalent.com`,
      department: 'Engineering',
      jobTitle: 'Frontend Engineer',
      role: 'employee',
    });
    actions.push(`Employee record created (${created.profile.employee_id})`);
    dataQuery.createTicket({
      employee_id: created.profile.id,
      employee_name: name,
      subject: 'Background verification',
      description: 'Initiate BGV for Monday joiner',
      department: 'HR Query',
      priority: 'High',
    });
    actions.push('Documents requested / BGV ticket opened');
    dataQuery.createTicket({
      employee_id: created.profile.id,
      employee_name: name,
      subject: 'IT account + Slack + email',
      description: 'Rippling-style joiner: identity, mailbox, collaboration apps',
      department: 'IT Support',
      priority: 'High',
    });
    actions.push('IT account request created');
    dataQuery.addAsset({
      name: 'Laptop — joiner pack',
      type: 'Laptop',
      serial: `LAP-${created.profile.employee_id}`,
      assigned_to: created.profile.id,
      assigned_name: name,
      status: 'Assigned',
      assigned_on: new Date().toISOString().slice(0, 10),
    });
    actions.push('Laptop request created');
    dataQuery.addJourneyEvent({
      employee_id: created.profile.id,
      at: new Date().toISOString().slice(0, 10),
      kind: 'Onboarding',
      title: 'Orientation scheduled',
      detail: 'Monday induction + probation workflow configured',
    });
    actions.push('Manager notified via journey event');
    actions.push('Orientation scheduled');
    dataQuery.addGoal({
      owner: name,
      owner_id: created.profile.id,
      title: '30-day frontend ramp',
      key_result: 'Ship first production PR and complete security training',
      progress: 0,
      status: 'On track',
      cycle: 'Onboarding',
    });
    actions.push('Training plan created');
    actions.push('Probation workflow configured');
    dataQuery.addFeedPost({
      author: actor.name,
      authorRole: actor.role,
      authorId: actor.profileId,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}`,
      title: `Joiner pack ready for ${name}`,
      content: 'Chief of Staff assembled record, IT, laptop, orientation, and probation.',
    });
    const reply = [
      `Onboarding pack for ${name} (Frontend Engineer, Monday):`,
      ...actions.map((a) => `✓ ${a}`),
      '',
      'This is an executable Chief of Staff run against the same employee graph — not a chatbot answer.',
    ].join('\n');
    dataQuery.logAgentRun({ actor: actor.name, prompt, summary: `Onboarded ${name}`, actions });
    return { reply, actions };
  }

  if (/(approve.*leave|pending leave)/i.test(q)) {
    const pending = dataQuery.listLeaveRequests().filter((l) => l.status === 'Pending');
    pending.forEach((l) => dataQuery.updateLeaveStatus(l.id, 'Approved'));
    dataQuery.listApprovals()
      .filter((a) => a.status === 'Pending' && a.kind === 'Leave')
      .forEach((a) => dataQuery.decideApproval(a.id, 'Approved'));
    actions.push(`Approved ${pending.length} leave request(s) within your permissions`);
    const reply = actions.join('\n');
    dataQuery.logAgentRun({ actor: actor.name, prompt, summary: reply, actions });
    return { reply, actions };
  }

  if (/(how many employee|headcount|how many people)/i.test(q)) {
    const n = dataQuery.dashboardStats().headcount;
    return {
      reply: `Active headcount is ${n}. Open the People OS if you want why it moved, not only the number.`,
      actions: [],
    };
  }

  if (/(what if|simulate|hire \d+)/i.test(q)) {
    const n = Number((prompt.match(/(\d+)/) || [0, 20])[1]);
    const sim = simulateHire(n || 20);
    const reply = [
      `+${sim.hires} ${sim.role}s`,
      `Projected annual workforce cost: ${sim.formatted.annualWorkforce}`,
      `Recruitment: ${sim.formatted.recruitmentCost}`,
      `Hiring timeline: ~${sim.timelineWeeks} weeks`,
      `Managerial bottleneck: ${sim.bottleneck}`,
      `Recommended additional hiring: ${sim.extraManagers} manager(s)`,
    ].join('\n');
    dataQuery.logAgentRun({ actor: actor.name, prompt, summary: reply, actions: ['Ran what-if simulator'] });
    return { reply, actions: ['Ran what-if simulator'] };
  }

  if (/(why.*(attrition|risk)|attrition)/i.test(q)) {
    const why = whyEngine('attrition', db);
    const reply = [
      why.value,
      '',
      'Top contributors',
      ...why.contributors.map((c) => `• ${c.label} — ${c.share}%`),
      '',
      'Recommended interventions',
      ...why.interventions.map((i) => `${i.area}: ${i.action}`),
    ].join('\n');
    return { reply, actions: [] };
  }

  if (/(brief|monday morning|this week)/i.test(q)) {
    const brief = peopleBrief(db);
    return { reply: [brief.title, ...brief.bullets, `Recommended action: ${brief.recommended}`].join('\n'), actions: [] };
  }

  if (/(internet|wfh|work from home|leave policy|reimburse)/i.test(q)) {
    const pol = interpretPolicy(prompt, actor.profileId, db);
    return { reply: `${pol.answer}\n\nSource: ${pol.policy}`, actions: [] };
  }

  if (/(run workflow|promotion pack|start exit|offboard)/i.test(q)) {
    if (q.includes('exit') || q.includes('offboard')) {
      const target = db.employees.find((e) => e.profile.employee_id === 'PEP0013') || db.employees[1];
      dataQuery.addOffboarding({
        employee_id: target.profile.id,
        employee_name: target.profile.full_name,
        last_working_day: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
        reason: 'Resignation — agent initiated clearance',
      });
      actions.push('Exit workflow started: notice, assets, access, F&F checklist');
    } else {
      actions.push('Promotion recipe: performance check → band check → letter → payroll (queued)');
      dataQuery.addJourneyEvent({
        employee_id: actor.profileId,
        at: new Date().toISOString().slice(0, 10),
        kind: 'Promotion',
        title: 'Promotion workflow started',
        detail: 'Agent queued compensation + letter steps',
      });
    }
    dataQuery.logAgentRun({ actor: actor.name, prompt, summary: actions.join('; '), actions });
    return { reply: actions.join('\n'), actions };
  }

  const stats = dataQuery.dashboardStats();
  return {
    reply: [
      'I am the HR Chief of Staff on this tenant’s graph — I can execute, not only chat.',
      '',
      `Right now: ${stats.headcount} people, ${stats.pendingApprovals} approvals, ${stats.openJobs} open jobs.`,
      '',
      'Try:',
      '• Prepare everything required for onboarding the new frontend engineer joining Monday',
      '• Approve pending leave',
      '• What happens if we hire 20 developers?',
      '• Why is attrition up?',
      '• Can I claim internet reimbursement?',
      '• Weekly people brief',
    ].join('\n'),
    actions: [],
  };
}

export { inr };
