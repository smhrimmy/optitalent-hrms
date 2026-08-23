import { Shield, ShieldAlert, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function RoleBuilderPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Role Builder</h1>
          <p className="text-neutral-400">Design advanced attribute-based roles for your company.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {/* Steps */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Configuration Steps</h2>
            <div className="space-y-6">
              <StepItem number={1} title="Identity & Details" desc="Name, description, template." active />
              <StepItem number={2} title="Permissions" desc="Resource and Action selection." />
              <StepItem number={3} title="Target Population" desc="Who can this role affect?" />
              <StepItem number={4} title="Scope & Conditions" desc="Geographic or dynamic limits." />
              <StepItem number={5} title="Review & Publish" desc="Simulate and activate." />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {/* Active Step Content */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">1. Role Identity</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Role Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Regional HR Manager (EMEA)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe the responsibilities and scope of this role..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-200">Global Template Synchronization</h4>
                  <p className="text-xs text-blue-300/70 mt-1">
                    If this role is mapped to a global template, changes made here will be overridden by the Platform Owner unless you detach it.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all">
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, desc, active, completed }: { number: number, title: string, desc: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors
          ${active ? 'bg-blue-600 text-white' : completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
          {completed ? <Check className="w-4 h-4" /> : number}
        </div>
        <div className="w-0.5 h-full bg-neutral-800 mt-2 rounded-full" />
      </div>
      <div className="pb-6">
        <h3 className={`text-sm font-medium ${active ? 'text-white' : 'text-neutral-400'}`}>{title}</h3>
        <p className="text-xs text-neutral-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
