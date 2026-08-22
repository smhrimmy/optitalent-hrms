'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useDataQuery } from '@/hooks/use-dataquery';
import { commandCenter, peopleBrief, whyEngine, inr } from '@/lib/workforce-os';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CommandCenterPage() {
  const db = useDataQuery();
  const { user } = useAuth();
  const cc = commandCenter(db);
  const brief = peopleBrief(db);
  const why = whyEngine('attrition', db);
  const role = user?.role || 'hr';

  const tiles = [
    { href: '/digital-twin', label: 'Digital twin', hint: 'Live org + signals' },
    { href: '/simulator', label: 'What-if simulator', hint: 'Hire 20 developers' },
    { href: '/why', label: 'Why engine', hint: 'Contributors + next action' },
    { href: '/talent-marketplace', label: 'Talent market', hint: 'Skills → internal mobility' },
    { href: '/manager-copilot', label: 'Manager copilot', hint: 'What needs you today' },
    { href: '/work-health', label: 'Work health', hint: 'Load, not medical' },
    { href: '/workflows', label: 'Workflows', hint: 'Install and execute' },
    { href: '/compliance-iq', label: 'Compliance IQ', hint: 'PF ESI PT TDS LWF' },
    { href: '/ai-tools/chatbot', label: 'Chief of Staff', hint: 'Execute, don’t only chat' },
    { href: '/people-brief', label: 'People brief', hint: 'Monday morning' },
    { href: '/opportunities', label: 'Opportunities', hint: 'Projects and seats' },
  ];

  return (
    <div className="space-y-8">
      <OsHeader
        kicker="People OS"
        title="Understand, explain, predict, recommend, execute"
        lede="Table-stakes HRMS already records what happened. This layer sits on the same employee graph and tells HR, managers, and employees what to do next."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Employees', String(cc.employees)],
          ['Hiring live', String(cc.hiring)],
          ['Open roles', String(cc.openRoles)],
          ['Payroll (last runs)', inr(cc.payroll)],
          ['People cost (loaded)', inr(cc.peopleCost)],
          ['High-signal people', String(cc.highRisk.length)],
          ['Critical skill watch', String(cc.criticalSkills)],
          ['Hot teams', String(cc.highWorkloadTeams.length || 0)],
        ].map(([k, v]) => (
          <Card key={k}>
            <CardHeader className="pb-1">
              <p className="text-xs text-muted-foreground">{k}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-headline font-semibold">{v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What changed — and what to do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {brief.bullets.map((b) => (
            <p key={b}>{b}</p>
          ))}
          <p className="font-medium">Recommended: {brief.recommended}</p>
          <p className="text-muted-foreground text-xs">
            Risk scores are decision support. They are not an automated judgment about a person.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why attrition attention is concentrated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {why.contributors.map((c) => (
              <div key={c.label} className="flex justify-between gap-4">
                <span>{c.label}</span>
                <span className="tabular-nums text-muted-foreground">{c.share}%</span>
              </div>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href={`/${role}/why`}>Open Why engine</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attention list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {cc.highRisk.slice(0, 5).map((p) => (
              <div key={p.id} className="flex justify-between gap-3">
                <span>
                  {p.name} · {p.role}
                </span>
                <span className="tabular-nums">{p.attritionRisk}%</span>
              </div>
            ))}
            {!cc.highRisk.length ? <p className="text-muted-foreground">No elevated signals.</p> : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={`/${role}${t.href}`}
            className="rounded-md border bg-card p-4 hover:border-primary/40 transition-colors"
          >
            <p className="font-medium">{t.label}</p>
            <p className="text-sm text-muted-foreground">{t.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
