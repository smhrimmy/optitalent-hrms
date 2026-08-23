'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaneTakeoff, ShieldAlert, FileText, IndianRupee, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobilitySimulatorUI() {
  const router = useRouter();
  const [targetEntity, setTargetEntity] = useState<string | undefined>();
  const [simulated, setSimulated] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">International Mobility</h1>
          <p className="text-muted-foreground mt-2">
            Simulate the impact of transferring an employee across borders.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/global')}>
          Back to Global Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/30">
          <div className="flex gap-4 items-end">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium">Employee</label>
              <Select defaultValue="emp-1">
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emp-1">John Doe (OptiTalent Global - US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center pb-2 px-2 text-muted-foreground">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium">Target Entity</label>
              <Select value={targetEntity} onValueChange={setTargetEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPT-INDIA">OptiTalent India Pvt Ltd (IN)</SelectItem>
                  <SelectItem value="OPT-UK">OptiTalent UK Ltd (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setSimulated(true)} disabled={!targetEntity}>
              Run Simulation
            </Button>
          </div>
        </CardHeader>

        {simulated && targetEntity === 'OPT-INDIA' && (
          <CardContent className="pt-6 space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded p-4 flex gap-3">
              <ShieldAlert className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">High Impact Transfer</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Transferring from United States (US) to India (IN) involves significant statutory changes.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Simulation Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <IndianRupee className="h-4 w-4" /> Payroll & Currency
                  </div>
                  <p className="text-sm">Base salary will be converted to <strong>INR</strong>. Statutory deductions for Provident Fund (EPF) and Professional Tax will apply.</p>
                </div>

                <div className="border rounded p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <FileText className="h-4 w-4" /> Compliance & Visa
                  </div>
                  <p className="text-sm">Employee is a US Citizen. Work authorization / Employment Visa required for India. I-9 obligations in the US will cease upon transfer.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Required Workflows</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Initiate Visa Check for India
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Draft localized PTO retention agreement
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Lock USD to INR Exchange Rate for Offer Letter
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button variant="outline">Export Report</Button>
              <Button>Initiate Transfer Workflows</Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
