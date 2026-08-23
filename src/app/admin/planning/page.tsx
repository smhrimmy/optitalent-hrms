'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlanningDashboard() {
  const router = useRouter();
  
  // Mock Gap Analysis Data
  const currentHeadcount = 1250;
  const targetHeadcount2027 = 1500;
  const gap = targetHeadcount2027 - currentHeadcount;

  const criticalShortages = [
    { role: 'Senior Machine Learning Engineer', current: 12, required: 30, gap: 18 },
    { role: 'Data Scientist', current: 25, required: 45, gap: 20 },
    { role: 'Cloud Architect', current: 5, required: 15, gap: 10 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Strategic Workforce Planning</h1>
          <p className="text-muted-foreground mt-2">
            Capacity forecasting and gap analysis driven by the Digital Twin.
          </p>
        </div>
        <Button onClick={() => router.push('/admin/planning/scenarios')} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Run Scenario Simulator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Headcount</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentHeadcount}</div>
            <p className="text-xs text-muted-foreground">Active Digital Twins</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target 2027-Q4</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetHeadcount2027}</div>
            <p className="text-xs text-muted-foreground">Approved Forecast</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Capacity Gap</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{gap}</div>
            <p className="text-xs text-orange-600">Net new roles required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Role Shortages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalShortages.map((shortage, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <h4 className="font-medium">{shortage.role}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current: {shortage.current} / Required: {shortage.required}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                    Gap: {shortage.gap}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">High Risk</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
