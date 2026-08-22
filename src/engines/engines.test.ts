import { proposeBlueprint, DEMO_ANSWERS } from '@/lib/company-blueprint';
import { authorize } from '@/engines/permission';
import { effectivePolicies } from '@/engines/policy';

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const tech = proposeBlueprint(DEMO_ANSWERS);
const mfg = proposeBlueprint({ ...DEMO_ANSWERS, industry: 'manufacturing', shifts: true, contractors: true });

assert(tech.modules.find((m) => m.id === 'factory')?.state === 'disabled', 'tech must not enable factory');
assert(mfg.modules.find((m) => m.id === 'factory')?.state === 'enabled', 'mfg must enable factory');

const employeeSalary = authorize(tech, { role: 'employee' }, { module: 'payroll', action: 'view', field: 'salary' });
assert(!employeeSalary.ok, 'employee cannot view salary');

const hrSalary = authorize(tech, { role: 'hr' }, { module: 'core_hr', action: 'view', field: 'salary' });
assert(hrSalary.ok, 'hr can view salary');

const leave = effectivePolicies(tech, {
  country: 'India',
  employmentType: 'Full-time',
  tenureMonths: 12,
});
assert(leave.some((p) => p.result.includes('18')), 'India FT leave 18 days');

console.log('engines.test.ts ok');
