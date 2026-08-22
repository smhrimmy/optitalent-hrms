'use client';

import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STORES = [
  { code: '#104', city: 'Bengaluru', manager: 'Kavya Rao', headcount: 28, coverage: '96%', seasonal: 6 },
  { code: '#118', city: 'Mysuru', manager: 'Imran Khan', headcount: 18, coverage: '88%', seasonal: 4 },
  { code: '#201', city: 'Chennai', manager: 'Divya S', headcount: 32, coverage: '91%', seasonal: 11 },
];

export default function StoresPage() {
  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Retail operating model"
        title="Region → area → store → department"
        lede="Geo-fenced attendance, shift swaps, seasonal seats, and store-level coverage. Store managers never see payroll."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {STORES.map((s) => (
          <Card key={s.code}>
            <CardHeader>
              <CardTitle className="text-base">
                Store {s.code} · {s.city}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>Manager {s.manager}</p>
              <p>{s.headcount} staff · {s.seasonal} seasonal</p>
              <p>Coverage {s.coverage}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
