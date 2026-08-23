'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserMinus, IndianRupee, BrainCircuit, AlertTriangle, Lightbulb, 
  TrendingUp, TrendingDown, Clock, MousePointer2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExecutiveAnalyticsDashboard() {
  const router = useRouter();

  const metrics = [
    { label: 'Workforce', value: '1,284', icon: Users, trend: '+4.2%', upIsGood: true },
    { label: 'Open Positions', value: '47', icon: UserMinus, trend: '-8%', upIsGood: false },
    { label: 'Attrition', value: '8.7%', icon: TrendingDown, trend: '+1.2%', upIsGood: false, alert: true },
    { label: 'Payroll Cost', value: '₹14.2Cr', icon: IndianRupee, trend: '+2.1%', upIsGood: false },
    { label: 'Skill Coverage', value: '82%', icon: BrainCircuit, trend: '+3%', upIsGood: true },
    { label: 'Overtime', value: '1,420 hrs', icon: Clock, trend: '+13%', upIsGood: false, alert: true },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce Briefing</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Data current as of {new Date().toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/analytics/explorer')} className="gap-2">
          <MousePointer2 className="h-4 w-4" />
          Workforce Explorer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The "What Changed?" Briefing */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              What Changed Since Last Month?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Headcount increased by <strong>18</strong>, bringing open positions down to 47. However, we detected a <strong>13% spike in overtime</strong> in the Engineering department. 
            </p>
            <Alert variant="destructive" className="bg-white border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Anomaly Detected</AlertTitle>
              <AlertDescription className="text-red-700">
                Engineering attrition increased 2.1% against baseline. This is highly correlated with the recent spike in workload and compensation compression vs market.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Why Engine Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider">
              Diagnostic Insights
            </CardTitle>
            <h3 className="text-xl font-bold">Why did Attrition change?</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-red-600">8.7%</div>
              <Badge variant="outline" className="text-red-600 bg-red-50">+1.8% vs last period</Badge>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Largest contributing segments:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span>Engineering</span>
                  <span className="text-red-600">+2.1pp</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Bangalore</span>
                  <span className="text-red-600">+1.2pp</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Data confidence: <strong>Medium</strong> (Correlation ≠ Causation)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Grid */}
      <h3 className="text-xl font-bold mt-8">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className={m.alert ? 'border-orange-200 bg-orange-50/30' : ''}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-muted-foreground line-clamp-1">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.alert ? 'text-orange-500' : 'text-muted-foreground'}`} />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className={`text-xl font-bold ${m.alert ? 'text-orange-700' : ''}`}>
                {m.value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-medium">
                <span className={
                  m.trend.startsWith('+') 
                    ? (m.upIsGood ? 'text-green-600' : 'text-red-600')
                    : (m.upIsGood ? 'text-red-600' : 'text-green-600')
                }>
                  {m.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
