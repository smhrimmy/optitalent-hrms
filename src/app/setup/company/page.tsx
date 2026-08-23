'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBlueprint } from '../../../lib/company/blueprints';
import { moduleRegistry } from '../../../lib/modules/registry';
import { CompanyDNA } from '../../../lib/company/types';

export default function CompanyOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dna, setDna] = useState<Partial<CompanyDNA>>({
      workforceTypes: [],
      workModels: [],
      enabledModules: []
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const ind = e.target.value as any;
      const bp = getBlueprint(ind);
      setDna({
          ...dna,
          industry: ind,
          enabledModules: bp ? moduleRegistry.resolveDependencies(bp.recommendedModules) : [],
          workforceTypes: bp?.recommendedWorkforceTypes || [],
      });
  };

  const handleFinish = async () => {
      // In a real app, this would POST to an API route to save the company configuration.
      // For this demo, we'll set a cookie or simply alert and redirect.
      alert('Company Configuration Activated! Modules and navigation will now adapt.');
      router.push('/admin/company');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20">
      <div className="w-full max-w-3xl rounded-xl border bg-card p-8 shadow-sm">
        
        {/* Header */}
        <div className="mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold tracking-tight">OptiTalent Setup</h1>
            <p className="text-muted-foreground text-sm">Step {step} of 5</p>
        </div>

        {/* Wizard Steps */}
        <div className="space-y-6">
            
            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium">Company Profile</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Name</label>
                        <input className="w-full rounded-md border p-2" placeholder="Acme Corp" 
                            onChange={e => setDna({...dna, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Industry</label>
                        <select className="w-full rounded-md border p-2" onChange={handleIndustryChange} value={dna.industry || ''}>
                            <option value="" disabled>Select Industry...</option>
                            <option value="Technology">Technology</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-2">
                            Selecting an industry automatically recommends specific modules, workforce types, and policies.
                        </p>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium">Size & Geography</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Employee Count</label>
                        <select className="w-full rounded-md border p-2" onChange={e => setDna({...dna, size: e.target.value as any})}>
                            <option>1-25</option>
                            <option>26-100</option>
                            <option>101-500</option>
                            <option>500+</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Operating Model</label>
                        <select className="w-full rounded-md border p-2" onChange={e => setDna({...dna, operatingModel: e.target.value as any})}>
                            <option value="Department-based">Department-based</option>
                            <option value="Plant-based">Plant-based (Manufacturing)</option>
                            <option value="Store-based">Store-based (Retail)</option>
                            <option value="Project-based">Project-based (Services)</option>
                        </select>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium">Workforce Configuration</h2>
                    <p className="text-sm text-muted-foreground">Based on your industry, we recommend tracking these worker types:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {dna.workforceTypes?.map(wt => (
                            <span key={wt} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                ✓ {wt}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium">Module Configuration</h2>
                    <p className="text-sm text-muted-foreground">The following modules have been activated for a {dna.industry} company.</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {dna.enabledModules?.map(modId => {
                            const mod = moduleRegistry.getModule(modId);
                            return (
                                <div key={modId} className="border p-3 rounded-md bg-muted/10">
                                    <h4 className="font-medium text-sm">{mod?.name || modId}</h4>
                                    <p className="text-xs text-muted-foreground">{mod?.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-medium">Review & Activate</h2>
                    <div className="rounded-md bg-primary/5 p-4 space-y-2 border border-primary/20">
                        <p className="font-semibold">Company: {dna.name}</p>
                        <p>Industry: {dna.industry}</p>
                        <p>Operating Model: {dna.operatingModel}</p>
                        <p>Modules Enabled: {dna.enabledModules?.length}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Activating this configuration will generate the sidebar navigation, setup custom employee fields, and deploy industry policies.
                    </p>
                </div>
            )}

        </div>

        {/* Footer actions */}
        <div className="mt-8 flex justify-between border-t pt-4">
            <button 
                onClick={handleBack} 
                disabled={step === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50">
                Back
            </button>
            {step < 5 ? (
                <button 
                    onClick={handleNext}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    Continue
                </button>
            ) : (
                <button 
                    onClick={handleFinish}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">
                    Activate Configuration
                </button>
            )}
        </div>

      </div>
    </div>
  );
}
