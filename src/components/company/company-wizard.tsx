'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { dataQuery } from '@/lib/dataquery';
import {
  INDUSTRIES,
  INDUSTRY_LABEL,
  SIZE_BANDS,
  WORK_MODELS,
  MODULE_REGISTRY,
  proposeBlueprint,
  flattenOrg,
  type CompanyAnswers,
  type Industry,
  type SizeBand,
  type WorkModel,
} from '@/lib/company-blueprint';

const PRESETS: { label: string; answers: Partial<CompanyAnswers> }[] = [
  { label: 'Software startup · 50 · India · remote', answers: { industry: 'technology', sizeBand: '26-100', workModel: 'remote', workforceMix: 'white-collar', contractors: false, shifts: false } },
  { label: 'Manufacturing · 2,800 · 4 plants', answers: { industry: 'manufacturing', sizeBand: '2001-10000', workModel: 'factory', workforceMix: 'mixed', contractors: true, shifts: true, locations: 4 } },
  { label: 'Retail · 85 stores · seasonal', answers: { industry: 'retail', sizeBand: '501-2000', workModel: 'store', seasonal: true, shifts: true, locations: 85 } },
  { label: 'Healthcare · licensed · 24/7', answers: { industry: 'healthcare', sizeBand: '501-2000', workModel: '24/7', licensedProfessionals: true, shifts: true } },
  { label: 'Banking · multi-entity', answers: { industry: 'banking', sizeBand: '501-2000', workModel: 'office' } },
  { label: 'Consulting · billable', answers: { industry: 'professional_services', sizeBand: '101-500', workModel: 'hybrid' } },
];

export function CompanyWizard({ afterApplyHref }: { afterApplyHref?: string }) {
  const router = useRouter();
  const current = dataQuery.getCompany();
  const [answers, setAnswers] = useState<CompanyAnswers>(current.answers);
  const preview = useMemo(() => proposeBlueprint(answers), [answers]);
  const enabled = preview.modules.filter((m) => m.state === 'enabled');
  const off = preview.modules.filter((m) => m.state === 'disabled');

  const set = <K extends keyof CompanyAnswers>(key: K, value: CompanyAnswers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const apply = () => {
    dataQuery.applyCompanyBlueprint(preview, true);
    if (afterApplyHref) router.push(afterApplyHref);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Company type engine</p>
        <h1 className="text-3xl font-bold font-headline">Generate the HRMS from the organization</h1>
        <p className="text-muted-foreground mt-2">
          Industry + size + workforce + geography first. Modules, org tree, roles, and policies are a starting blueprint you can still change.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p.label} type="button" size="sm" variant="outline" onClick={() => setAnswers({ ...answers, ...p.answers, name: answers.name })}>
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Company name">
              <Input value={answers.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Industry">
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={answers.industry}
                onChange={(e) => set('industry', e.target.value as Industry)}
              >
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {INDUSTRY_LABEL[i]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Company size">
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={answers.sizeBand}
                onChange={(e) => set('sizeBand', e.target.value as SizeBand)}
              >
                {SIZE_BANDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Work / operating model">
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={answers.workModel}
                onChange={(e) => set('workModel', e.target.value as WorkModel)}
              >
                {WORK_MODELS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Countries (comma)">
              <Input value={answers.countries.join(', ')} onChange={(e) => set('countries', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />
            </Field>
            <Field label="States / regions">
              <Input value={answers.states.join(', ')} onChange={(e) => set('states', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Legal entities">
                <Input type="number" value={answers.entities} onChange={(e) => set('entities', Number(e.target.value))} />
              </Field>
              <Field label="Locations / plants / stores">
                <Input type="number" value={answers.locations} onChange={(e) => set('locations', Number(e.target.value))} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={answers.contractors} onChange={(e) => set('contractors', e.target.checked)} />
              Contractor / agency workforce
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={answers.licensedProfessionals} onChange={(e) => set('licensedProfessionals', e.target.checked)} />
              Licensed / credentialed professionals
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={answers.shifts} onChange={(e) => set('shifts', e.target.checked)} />
              Shift / 24×7 roster
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={answers.seasonal} onChange={(e) => set('seasonal', e.target.checked)} />
              Seasonal / temporary workers
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={answers.multiCountry} onChange={(e) => set('multiCountry', e.target.checked)} />
              Multi-country
            </label>
            <Button className="w-full" onClick={apply}>
              Generate this HRMS
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Proposed edition: {preview.edition}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                {INDUSTRY_LABEL[answers.industry]} · {answers.sizeBand} · {answers.workModel} · {answers.countries.join('/')}
              </p>
              <p className="text-muted-foreground">Worker types: {preview.workerTypes.join(', ')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activate ({enabled.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1">
              {enabled.map((m) => (
                <Badge key={m.id} variant="secondary">
                  {MODULE_REGISTRY.find((r) => r.id === m.id)?.label || m.id}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Do not activate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1">
              {off.slice(0, 18).map((m) => (
                <Badge key={m.id} variant="outline">
                  {MODULE_REGISTRY.find((r) => r.id === m.id)?.label || m.id}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization model</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-xs space-y-1">
              {flattenOrg(preview.orgModel).map((n, i) => (
                <p key={`${n.name}-${i}`} style={{ paddingLeft: n.depth * 12 }}>
                  {n.depth ? '└ ' : ''}
                  {n.name}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
