'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, PlaneTakeoff, IndianRupee, DollarSign, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalWorkforceDashboard() {
  const router = useRouter();

  const entities = [
    { id: 'OPT-GLOBAL', name: 'OptiTalent Global', country: 'US', currency: 'USD', headcount: 850 },
    { id: 'OPT-INDIA', name: 'OptiTalent India Pvt Ltd', country: 'IN', currency: 'INR', headcount: 312 },
    { id: 'OPT-UK', name: 'OptiTalent UK Ltd', country: 'UK', currency: 'GBP', headcount: 122 },
  ];

  const fxRates = [
    { pair: 'USD / INR', rate: '83.33', updated: 'Today' },
    { pair: 'USD / GBP', rate: '0.79', updated: 'Today' },
    { pair: 'USD / EUR', rate: '0.92', updated: 'Today' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Organization</h1>
          <p className="text-muted-foreground mt-2">
            Manage legal entities, localization, and multi-currency operations.
          </p>
        </div>
        <Button onClick={() => router.push('/admin/global/mobility')} className="gap-2">
          <PlaneTakeoff className="h-4 w-4" />
          Mobility Simulator
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Legal Entities & Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entities.map(e => (
                <div key={e.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {e.name}
                      <Badge variant="outline">{e.country}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Base Currency: {e.currency}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{e.headcount}</div>
                    <div className="text-xs text-muted-foreground">Employees</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              FX Rates (Base: USD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fxRates.map((fx, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div className="font-medium text-sm">{fx.pair}</div>
                  <div className="text-right">
                    <div className="font-bold">{fx.rate}</div>
                    <div className="text-xs text-muted-foreground">Updated {fx.updated}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">Manage FX Table</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
