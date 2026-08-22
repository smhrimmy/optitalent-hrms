'use client';

import { useDataQuery } from '@/hooks/use-dataquery';
import { flattenOrg, INDUSTRY_LABEL } from '@/lib/company-blueprint';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OperatingModelPage() {
  const db = useDataQuery();
  const c = db.company;
  const tree = flattenOrg(c.orgModel);

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Operating model"
        title={INDUSTRY_LABEL[c.answers.industry]}
        lede="The same product is a plant HRMS, a store HRMS, or a professional-services OS — because the org objects change, not because we renamed Attendance."
      />
      <div className="flex flex-wrap gap-2">
        <Badge>{c.edition}</Badge>
        <Badge variant="outline">{c.answers.workModel}</Badge>
        <Badge variant="outline">{c.answers.payroll} payroll</Badge>
        <Badge variant="outline">{c.workerTypes.length} worker types</Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-sm space-y-1">
            {tree.map((n, i) => (
              <p key={`${n.name}-${i}`} style={{ paddingLeft: n.depth * 16 }}>
                {n.name}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Worker types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {c.workerTypes.map((w) => (
              <Badge key={w} variant="secondary">
                {w}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
