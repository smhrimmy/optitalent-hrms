import { getCompanyContext } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Activity, Building2, Server, Users } from "lucide-react";

export default async function SuperAdminDashboard() {
  const context = await getCompanyContext();
  
  if (!context || context.platformRole !== 'platform_owner') {
    redirect("/suspended");
  }

  // Fetch some high-level metrics
  const { count: companyCount } = await supabase.from('companies').select('*', { count: 'exact', head: true });
  const { count: identityCount } = await supabase.from('platform_identities').select('*', { count: 'exact', head: true });
  const { count: activeMemberships } = await supabase.from('company_memberships').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Overview</h1>
        <p className="text-neutral-400">Global control plane for OptiTalent multi-company infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Active Companies" value={companyCount || 0} icon={<Building2 className="w-5 h-5" />} trend="+2 this week" />
        <MetricCard title="Global Identities" value={identityCount || 0} icon={<Users className="w-5 h-5" />} trend="+45 this week" />
        <MetricCard title="Active Memberships" value={activeMemberships || 0} icon={<Activity className="w-5 h-5" />} trend="Across all companys" />
        <MetricCard title="System Status" value="Online" icon={<Server className="w-5 h-5 text-emerald-400" />} trend="99.99% uptime" isStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Infrastructure Events</h2>
          <div className="space-y-4">
            <EventRow time="10 mins ago" desc="New company company [Acme Corp] provisioned." type="success" />
            <EventRow time="1 hour ago" desc="Platform-wide security scan completed. 0 anomalies." type="info" />
            <EventRow time="2 hours ago" desc="Emergency lockdown tested in sandbox region." type="warning" />
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
             <button className="flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors text-white">
                Provision New Company
                <span className="text-neutral-400">&rarr;</span>
             </button>
             <button className="flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors text-white">
                Global Identity Search
                <span className="text-neutral-400">&rarr;</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, isStatus = false }: { title: string; value: string | number; icon: React.ReactNode; trend: string; isStatus?: boolean }) {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         {icon}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isStatus ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className={`text-xs ${isStatus ? 'text-emerald-400' : 'text-neutral-500'}`}>{trend}</div>
    </div>
  );
}

function EventRow({ time, desc, type }: { time: string; desc: string; type: 'success' | 'warning' | 'info' }) {
  const colors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 relative">
        <div className={`absolute inset-0 rounded-full ${colors[type]} animate-ping opacity-50`} />
        <div className={`relative w-2 h-2 rounded-full ${colors[type]}`} />
      </div>
      <div>
        <p className="text-sm text-neutral-300">{desc}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
