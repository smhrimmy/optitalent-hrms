'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, LineChart, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WorkforceExplorer() {
  const router = useRouter();
  
  // UI State for the Explorer
  const [metric, setMetric] = useState('avg_compensation');
  const [dimension, setDimension] = useState('department');

  // Mock data reflecting privacy thresholds
  const getMockData = () => {
    if (metric === 'avg_compensation' && dimension === 'department') {
      return [
        { label: 'Engineering', value: '₹140,000' },
        { label: 'Sales', value: '₹120,000' },
        { label: 'Marketing', value: '₹90,000' },
        { label: 'Executive', value: 'REDACTED', redacted: true, reason: 'Privacy threshold < 5' }
      ];
    }
    
    if (metric === 'attrition_rate') {
      return [
        { label: 'Engineering', value: '10.2%' },
        { label: 'Sales', value: '4.1%' },
        { label: 'Marketing', value: '2.0%' }
      ];
    }

    return [];
  };

  const data = getMockData();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Slice and dice analytics data securely.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/analytics')}>
          Back to Briefing
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/30">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-medium">Metric</label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headcount">Headcount</SelectItem>
                  <SelectItem value="attrition_rate">Attrition Rate</SelectItem>
                  <SelectItem value="avg_compensation">Average Compensation</SelectItem>
                  <SelectItem value="skill_coverage">Skill Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Group By (Dimension)</label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select dimension" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="employmentType">Employment Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-5">
              <Button>Run Query</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {data.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                <span className="font-medium">{row.label}</span>
                {row.redacted ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-sm font-bold bg-muted px-2 py-1 rounded">REDACTED</span>
                    <span className="text-xs">({row.reason})</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
