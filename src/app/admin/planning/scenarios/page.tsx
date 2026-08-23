'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScenariosDashboard() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>('hybrid');

  const scenarios = [
    {
      id: 'external',
      name: 'Scenario A: Pure External Hiring',
      description: 'Fill all 48 engineering gaps via external recruitment.',
      cost: '$6,480,000',
      timeToReady: '90 days',
      confidence: 80,
      interventions: [
        { type: 'HIRE', count: 48, detail: 'Avg $15k recruitment + $120k salary' }
      ],
      assumptions: ['High availability of external talent', 'Standard 3-month onboarding']
    },
    {
      id: 'internal',
      name: 'Scenario B: Maximum Internal Mobility',
      description: 'Promote 18 internals, backfill junior roles, hire 30 externals.',
      cost: '$4,120,000',
      timeToReady: '120 days',
      confidence: 70,
      interventions: [
        { type: 'DEVELOP', count: 18, detail: 'Avg $2.5k reskilling cost' },
        { type: 'HIRE', count: 30, detail: 'Backfill and remaining gaps' }
      ],
      assumptions: ['18 internals pass readiness assessment', 'Extended time for training']
    },
    {
      id: 'hybrid',
      name: 'Scenario C: Balanced Hybrid (Recommended)',
      description: 'Promote 10 high-readiness internals, hire 38 externals.',
      cost: '$5,240,000',
      timeToReady: '95 days',
      confidence: 92,
      interventions: [
        { type: 'DEVELOP', count: 10, detail: 'Only high-readiness candidates' },
        { type: 'HIRE', count: 38, detail: 'External hires' }
      ],
      assumptions: ['Low risk on internal promotions', 'Fast external pipeline']
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Simulator</h1>
          <p className="text-muted-foreground mt-2">
            Compare "Build vs Buy" talent strategies to close the 48-headcount gap in Engineering.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/planning')}>
          Back to Planning
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Decision Support</AlertTitle>
        <AlertDescription>
          These scenarios simulate cost and timeline impacts based on historical Payroll, Learning, and Recruitment data. No actions will be taken automatically.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer transition-all ${selectedScenario === scenario.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
                {scenario.id === 'hybrid' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{scenario.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Projected Cost</span>
                  <span className="font-bold">{scenario.cost}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Avg Time to Readiness</span>
                  <span className="font-bold">{scenario.timeToReady}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm text-muted-foreground">Execution Confidence</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{scenario.confidence}%</span>
                    {scenario.confidence > 85 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedScenario && (
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Selected Scenario Execution Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Interventions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.find(s => s.id === selectedScenario)?.interventions.map((intervention, idx) => (
                  <div key={idx} className="bg-background p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={intervention.type === 'HIRE' ? 'default' : 'secondary'}>
                        {intervention.type}
                      </Badge>
                      <span className="font-bold">{intervention.count} Headcount</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{intervention.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Assumptions & Limitations</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {scenarios.find(s => s.id === selectedScenario)?.assumptions.map((assumption, idx) => (
                  <li key={idx}>{assumption}</li>
                ))}
                <li>Costs are annualized projections based on current payroll averages.</li>
              </ul>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button variant="outline">Export Full Report</Button>
              <Button>Approve Workforce Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
