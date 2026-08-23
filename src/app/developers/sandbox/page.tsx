'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Code, Database, Globe, PlayCircle } from 'lucide-react';

export default function DeveloperSandbox() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Sandbox</h1>
          <p className="text-muted-foreground mt-2">
            Build and test OptiTalent Extensions in a secure, isolated company.
          </p>
        </div>
        <Button className="gap-2">
          <PlayCircle className="h-4 w-4" />
          Create New App
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Synthetic Data Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your sandbox company (`DEV-TENANT-99`) has been provisioned with 50 synthetic employees, mock payroll data, and standard company policies. You can safely test API calls without impacting production.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              API Gateway & Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Test your extension's webhooks locally. We provide an HMAC payload generator to verify your signature validation logic.
            </p>
            <Button variant="outline" className="mt-4 w-full text-xs">Open Webhook Tester</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-muted-foreground" />
            Manifest Validator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-950 p-4 rounded-md text-green-400 font-mono text-sm">
            $ optitalent-cli manifest validate ./my-extension<br/>
            [OK] Schema validation passed.<br/>
            [OK] 2 Scopes requested (employee.read, notifications.send).<br/>
            [OK] 1 Event subscribed (employee.onboarded).<br/>
            <br/>
            Ready for submission to Marketplace Review.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
