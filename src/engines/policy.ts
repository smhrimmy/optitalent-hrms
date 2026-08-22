import type { GeneratedConfig, PolicyRule } from '@/lib/company-blueprint';

export type PolicySubject = {
  country: string;
  employmentType: string;
  tenureMonths: number;
  department?: string;
  state?: string;
  workerType?: string;
  shift?: string;
  leaveDays?: number;
};

export type EffectivePolicy = {
  name: string;
  kind: PolicyRule['kind'];
  result: string;
  source: string;
  inheritedFrom: string;
  overriddenBy: string;
  effective: string;
  layer: PolicyRule['layer'];
};

function matches(rule: PolicyRule, subject: PolicySubject): boolean {
  return rule.when.every((w) => {
    const raw = (subject as Record<string, unknown>)[w.field];
    if (w.op === 'eq') return String(raw ?? '') === String(w.value);
    if (w.op === 'gt') return Number(raw ?? 0) >= Number(w.value);
    if (w.op === 'in') return Array.isArray(w.value) && w.value.map(String).includes(String(raw));
    return false;
  });
}

const LAYER_RANK: Record<PolicyRule['layer'], number> = {
  global: 0,
  country: 1,
  state: 2,
  location: 3,
  department: 4,
  job: 5,
  employment_type: 6,
  employee: 7,
};

/** Resolve the winning rule per kind. Higher layer wins (employee overrides country). */
export function effectivePolicies(dna: GeneratedConfig, subject: PolicySubject): EffectivePolicy[] {
  const byKind = new Map<string, PolicyRule>();
  const sorted = [...dna.policies].sort((a, b) => LAYER_RANK[a.layer] - LAYER_RANK[b.layer]);
  for (const rule of sorted) {
    if (matches(rule, subject)) byKind.set(rule.kind + ':' + rule.name, rule);
  }
  return [...byKind.values()].map((rule) => ({
    name: rule.name,
    kind: rule.kind,
    result: rule.then,
    source: `${dna.answers.industry} → ${rule.layer} policy`,
    inheritedFrom: `Layer: ${rule.layer}`,
    overriddenBy: rule.layer === 'employee' ? 'Employee exception' : 'None',
    effective: '2026-01-01',
    layer: rule.layer,
  }));
}
