import { dataQuery } from '@/lib/dataquery';
import { authorize, type Principal } from '@/engines/permission';
import { recordAudit } from '@/engines/audit';
import { TENANT_ID } from '@/engines/dna';
import { runWorkforceAgent } from '@/lib/workforce-os';
import { whyEngine, simulateHire, interpretPolicy } from '@/lib/workforce-os';
import type { FieldId } from '@/lib/company-blueprint';

export const AGENT_TOOLS = [
  'search_employees',
  'create_employee',
  'approve_leave',
  'create_job',
  'create_onboarding',
  'generate_report',
  'analyze_attrition',
  'explain_metric',
  'check_policy',
  'view_salary',
] as const;

export type ToolName = (typeof AGENT_TOOLS)[number];

const TOOL_ACL: Record<ToolName, { module: string; action: string; field?: FieldId }> = {
  search_employees: { module: 'core_hr', action: 'view' },
  create_employee: { module: 'core_hr', action: 'edit' },
  approve_leave: { module: 'leave', action: 'approve' },
  create_job: { module: 'recruitment', action: 'manage' },
  create_onboarding: { module: 'onboarding', action: 'manage' },
  generate_report: { module: 'ai', action: 'view' },
  analyze_attrition: { module: 'ai', action: 'view' },
  explain_metric: { module: 'ai', action: 'view' },
  check_policy: { module: 'core_hr', action: 'self' },
  view_salary: { module: 'payroll', action: 'view', field: 'salary' },
};

export function invokeTool(
  name: ToolName,
  principal: Principal & { name: string },
  args: Record<string, string> = {}
): { ok: boolean; text: string } {
  const dna = dataQuery.getCompany();
  const acl = TOOL_ACL[name];
  const gate = authorize(dna, principal, acl);
  if (!gate.ok) {
    recordAudit({
      user: principal.name,
      role: principal.role,
      entity: 'ai_tool',
      record: name,
      action: 'deny',
      after: gate.reason,
      source: 'ai',
      tenantId: TENANT_ID,
    });
    return { ok: false, text: `Denied: ${gate.reason}` };
  }

  let text = '';
  if (name === 'search_employees') {
    const q = (args.q || '').toLowerCase();
    const hits = dataQuery
      .listEmployees()
      .filter((e) => e.full_name.toLowerCase().includes(q) || e.job_title.toLowerCase().includes(q))
      .slice(0, 8);
    text = hits.map((e) => `${e.full_name} · ${e.job_title}`).join('\n') || 'No matches.';
  } else if (name === 'view_salary') {
    text = 'Salary figures are visible under your payroll scope. (Field ACL passed.)';
  } else if (name === 'explain_metric' || name === 'analyze_attrition') {
    const why = whyEngine(args.metric || 'attrition');
    text = `${why.value}\n${why.contributors.map((c) => `${c.label} ${c.share}%`).join('\n')}`;
  } else if (name === 'check_policy') {
    text = interpretPolicy(args.q || 'leave', args.employeeId).answer;
  } else if (name === 'generate_report') {
    const sim = simulateHire(Number(args.n || 20));
    text = `Scenario +${sim.hires}: ${sim.formatted.annualWorkforce}, bottleneck ${sim.bottleneck}`;
  } else {
    const agent = runWorkforceAgent(args.prompt || name, {
      name: principal.name,
      role: principal.role,
      profileId: args.profileId || '',
      employeeId: args.employeeId || '',
    });
    text = agent.reply;
  }

  recordAudit({
    user: principal.name,
    role: principal.role,
    entity: 'ai_tool',
    record: name,
    action: 'execute',
    after: text.slice(0, 180),
    source: 'ai',
    approvedBy: principal.role === 'employee' ? undefined : principal.name,
    tenantId: TENANT_ID,
  });
  return { ok: true, text };
}

export function runPermissionedAgent(
  prompt: string,
  principal: Principal & { name: string; profileId: string; employeeId: string }
) {
  const q = prompt.toLowerCase();
  if (q.includes('salary') || q.includes('ctc') || q.includes('bank')) {
    return invokeTool('view_salary', principal, { prompt });
  }
  if (q.includes('why') || q.includes('attrition')) {
    return invokeTool('analyze_attrition', principal, { prompt, metric: 'attrition' });
  }
  if (q.includes('policy') || q.includes('reimburse') || q.includes('wfh') || q.includes('leave balance')) {
    return invokeTool('check_policy', principal, { q: prompt, employeeId: principal.employeeId });
  }
  const dna = dataQuery.getCompany();
  const need = q.includes('onboard') || q.includes('approve') ? 'create_onboarding' : 'search_employees';
  const gate = authorize(dna, principal, TOOL_ACL[need === 'create_onboarding' ? 'create_employee' : 'search_employees']);
  if (!gate.ok && (q.includes('onboard') || q.includes('approve leave'))) {
    return { ok: false, text: `Denied: ${gate.reason}` };
  }
  const result = runWorkforceAgent(prompt, principal);
  recordAudit({
    user: principal.name,
    role: principal.role,
    entity: 'ai_agent',
    record: 'chief_of_staff',
    action: result.actions.length ? 'execute' : 'answer',
    after: result.reply.slice(0, 180),
    source: 'ai',
    tenantId: TENANT_ID,
  });
  return { ok: true, text: result.reply };
}
