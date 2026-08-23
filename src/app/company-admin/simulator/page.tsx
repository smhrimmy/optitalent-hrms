import { ShieldAlert, Search, Play, CheckCircle, XCircle } from "lucide-react";

export default function AccessSimulatorPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Access Simulator</h1>
        <p className="text-neutral-400">Debug and verify "Who can see what?" without logging in as them.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulation Configuration */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Configure Scenario
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Acting Identity (Who?)</label>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Target Resource (What?)</label>
              <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all">
                <option value="employee.salary">Employee Salary (employee.salary)</option>
                <option value="payroll.finalize">Run Payroll (payroll.finalize)</option>
                <option value="performance.review">Performance Review (performance.review)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Target Subject (Whose?)</label>
              <input 
                type="text" 
                placeholder="Search by name or email (leave empty for global action)..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
              <Play className="w-4 h-4 fill-current" />
              Run Simulation
            </button>
          </div>
        </div>

        {/* Simulation Results */}
        <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Simulation Result</h2>
          
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Access Granted</h3>
              <p className="text-neutral-400 mt-2 max-w-sm">
                Jane Doe (Regional HR Manager) is allowed to read Employee Salary for John Smith.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-800 pt-6">
            <h4 className="text-sm font-medium text-neutral-300 mb-4 uppercase tracking-wider">Evaluation Trace</h4>
            <div className="space-y-3">
              <TraceStep success message="Identity authenticated as jane.doe@acme.com" />
              <TraceStep success message="Active membership found for Acme Corp." />
              <TraceStep success message="Role 'Regional HR Manager' provides permission 'employee.salary.read'." />
              <TraceStep success message="Target Population check passed: John Smith is in 'EMEA Region'." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TraceStep({ success, message }: { success: boolean, message: string }) {
  return (
    <div className="flex items-start gap-3 bg-neutral-900/50 rounded-lg p-3 border border-neutral-800">
      {success ? (
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      )}
      <span className="text-sm text-neutral-300 font-mono">{message}</span>
    </div>
  );
}
