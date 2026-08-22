'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { MODULE_REGISTRY } from '@/lib/company-blueprint';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { OsHeader } from '@/components/workforce/os-header';

export default function FeatureMatrixPage() {
  const db = useDataQuery();
  const company = db.company;

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Feature matrix"
        title="Available · enabled · scope"
        lede="Factory, stores, credentials, and fleet are industry-only. The blueprint proposes; you still decide."
      />
      <p className="text-sm text-muted-foreground">
        {company.answers.name} · {company.edition} · {company.answers.industry}
      </p>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Module</th>
              <th className="p-3">Available</th>
              <th className="p-3">Enabled</th>
              <th className="p-3">Scope</th>
            </tr>
          </thead>
          <tbody>
            {company.modules.map((m) => {
              const meta = MODULE_REGISTRY.find((r) => r.id === m.id);
              const industryOk = !meta?.industries || meta.industries.includes(company.answers.industry);
              return (
                <tr key={m.id} className="border-t">
                  <td className="p-3">
                    <p className="font-medium">{meta?.label || m.id}</p>
                    <p className="text-xs text-muted-foreground">{meta?.category}</p>
                  </td>
                  <td className="p-3">{industryOk ? '✓' : '—'}</td>
                  <td className="p-3">
                    <Switch
                      checked={m.state === 'enabled'}
                      disabled={!industryOk}
                      onCheckedChange={() => dataQuery.toggleCompanyModule(m.id)}
                    />
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{m.state === 'enabled' ? m.scope : '—'}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Configuration hierarchy: global → tenant → legal entity → country → state → location → business unit → department → job family → employment type → employee. Effective policy is calculated, not copied onto every person.
        </CardContent>
      </Card>
    </div>
  );
}
