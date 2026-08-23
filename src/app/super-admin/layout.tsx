import Link from "next/link";
import { Building2, Users, Shield, Activity, Settings, Database } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-white/90">Global Control</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Platform Owner</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <NavItem href="/super-admin" icon={<Activity className="w-4 h-4" />} label="System Overview" />
          <NavItem href="/super-admin/companies" icon={<Building2 className="w-4 h-4" />} label="Companies (Companys)" />
          <NavItem href="/super-admin/identities" icon={<Users className="w-4 h-4" />} label="Global Identities" />
          <NavItem href="/super-admin/security" icon={<Shield className="w-4 h-4" />} label="Security & Kill Switches" />
          <NavItem href="/super-admin/settings" icon={<Settings className="w-4 h-4" />} label="Platform Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient background effects */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        
        <header className="h-16 border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-md flex items-center px-8 z-10">
          <h1 className="text-sm font-medium text-neutral-400">OptiTalent Infrastructure Plane</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 group"
    >
      <span className="text-neutral-500 group-hover:text-blue-400 transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
}
