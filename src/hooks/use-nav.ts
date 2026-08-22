
'use client';

import { useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  UserPlus,
  HelpCircle,
  BarChart2,
  DollarSign,
  ClipboardCheck,
  Award,
  Target,
  Factory,
  Building,
  Activity,
  ShieldCheck,
  Database,
  Puzzle,
  TrendingUp,
  Handshake,
  GraduationCap,
  CalendarOff,
  Newspaper,
  Clock,
  Heart,
  Sliders,
  Code,
  Wallet,
  Package,
  Network,
  UserMinus,
  Inbox,
  Gift,
  ClipboardList,
  BookUser,
  Sparkles,
  FlaskConical,
  Radar,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatedBot } from '@/components/ui/animated-bot';
import { useFeatures, type FeatureModule } from './use-features';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon | React.ComponentType<any>;
  featureId?: FeatureModule;
};

// Mapping of href (or label) to feature ID
const featureMapping: Record<string, FeatureModule> = {
  '/employees': 'employee_management',
  '/recruitment': 'recruitment',
  '/onboarding': 'employee_management',
  '/performance': 'performance',
  '/learning': 'training',
  '/leaves': 'leave',
  '/shifts': 'attendance',
  '/payroll': 'payroll',
  '/attendance': 'attendance',
  '/ai-tools': 'ai_tools',
  '/ai-tools/chatbot': 'ai_tools',
  '/ai-tools/career-predictor': 'ai_tools',
  '/command-center': 'ai_tools',
  '/digital-twin': 'ai_tools',
  '/simulator': 'ai_tools',
  '/why': 'ai_tools',
  '/talent-marketplace': 'ai_tools',
  '/opportunities': 'ai_tools',
  '/manager-copilot': 'ai_tools',
  '/work-health': 'ai_tools',
  '/workflows': 'ai_tools',
  '/people-brief': 'ai_tools',
  '/compliance-iq': 'compliance',
  '/admin-config': 'developer_tools', // Or just available for admin
  '/developer-panel': 'developer_tools',
  '/expenses': 'expenses',
  '/assets': 'assets',
  '/org-chart': 'org_chart',
  '/timesheets': 'timesheets',
  '/offboarding': 'offboarding',
  '/plants': 'factory',
  '/stores': 'stores',
  '/credentials': 'credentials',
  '/fleet': 'fleet',
  '/sites': 'sites',
};

const osNav: NavItem[] = [
  { label: 'People OS', href: '/command-center', icon: Sparkles, featureId: 'ai_tools' },
  { label: 'Digital Twin', href: '/digital-twin', icon: Radar, featureId: 'ai_tools' },
  { label: 'Why Engine', href: '/why', icon: HelpCircle, featureId: 'ai_tools' },
  { label: 'Simulator', href: '/simulator', icon: FlaskConical, featureId: 'ai_tools' },
  { label: 'Talent Market', href: '/talent-marketplace', icon: Handshake, featureId: 'ai_tools' },
  { label: 'Opportunities', href: '/opportunities', icon: Target, featureId: 'ai_tools' },
  { label: 'Manager Copilot', href: '/manager-copilot', icon: Users, featureId: 'ai_tools' },
  { label: 'Work Health', href: '/work-health', icon: Heart, featureId: 'ai_tools' },
  { label: 'Workflows', href: '/workflows', icon: Puzzle, featureId: 'ai_tools' },
  { label: 'Compliance IQ', href: '/compliance-iq', icon: ShieldCheck, featureId: 'compliance' },
  { label: 'People Brief', href: '/people-brief', icon: Newspaper, featureId: 'ai_tools' },
];

const osNavEmployee: NavItem[] = [
  { label: 'People OS', href: '/command-center', icon: Sparkles, featureId: 'ai_tools' },
  { label: 'Work Health', href: '/work-health', icon: Heart, featureId: 'ai_tools' },
  { label: 'Talent Market', href: '/talent-marketplace', icon: Handshake, featureId: 'ai_tools' },
  { label: 'Opportunities', href: '/opportunities', icon: Target, featureId: 'ai_tools' },
];

const typeNav: NavItem[] = [
  { label: 'Company type', href: '/company-setup', icon: Sliders },
  { label: 'Feature matrix', href: '/feature-matrix', icon: Puzzle },
  { label: 'Role builder', href: '/role-builder', icon: ShieldCheck },
  { label: 'Policy engine', href: '/policy-engine', icon: FileText },
  { label: 'Operating model', href: '/operating-model', icon: Network },
  { label: 'Plants', href: '/plants', icon: Factory, featureId: 'factory' },
  { label: 'Stores', href: '/stores', icon: Building, featureId: 'stores' },
  { label: 'Credentials', href: '/credentials', icon: Award, featureId: 'credentials' },
  { label: 'Fleet', href: '/fleet', icon: Truck, featureId: 'fleet' },
  { label: 'Sites', href: '/sites', icon: Factory, featureId: 'sites' },
];

function withOs(items: NavItem[], extra: NavItem[] = osNav): NavItem[] {
  if (!items.length) return extra;
  const dash = items[0];
  if (dash.href === '/dashboard' || dash.href === '/super-admin') {
    const rest = items.slice(1).map((item) =>
      item.href === '/ai-tools/chatbot' ? { ...item, label: 'Chief of Staff' } : item
    );
    return [dash, ...extra, ...rest];
  }
  return [...extra, ...items];
}

export const navConfig: Record<string, NavItem[]> = {
  'super-admin': [
    { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { label: 'Server Status', href: '/super-admin/server-health', icon: Activity },
    { label: 'Security Center', href: '/super-admin/security', icon: ShieldCheck },
    { label: 'Tenant Accounts', href: '/super-admin/tenants', icon: Users },
    { label: 'Backups & DR', href: '/super-admin/backups', icon: Database },
    { label: 'Global Settings', href: '/settings', icon: Settings },
  ],
  admin: withOs([
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Server Status', href: '/super-admin/server-health', icon: Activity }, // New WHM
    { label: 'Security Center', href: '/super-admin/security', icon: ShieldCheck }, // New WHM
    { label: 'Tenant Accounts', href: '/super-admin/tenants', icon: Users }, // Enhanced
    { label: 'Feature Config', href: '/admin-config', icon: Sliders }, 
    { label: 'Developer Panel', href: '/developer-panel', icon: Code, featureId: 'developer_tools' }, 
    { label: 'Backups & DR', href: '/super-admin/backups', icon: Database }, // Existing
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Directory', href: '/directory', icon: BookUser, featureId: 'employee_management' },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Employees', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Onboarding', href: '/onboarding', icon: UserPlus, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Goals', href: '/goals', icon: Target, featureId: 'performance' },
    { label: 'Compensation', href: '/compensation', icon: DollarSign, featureId: 'payroll' },
    { label: 'Benefits', href: '/benefits', icon: Gift, featureId: 'payroll' },
    { label: 'Surveys', href: '/surveys', icon: ClipboardList },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Expenses', href: '/expenses', icon: Wallet, featureId: 'expenses' },
    { label: 'Assets', href: '/assets', icon: Package, featureId: 'assets' },
    { label: 'Timesheets', href: '/timesheets', icon: FileText, featureId: 'timesheets' },
    { label: 'Org Chart', href: '/org-chart', icon: Network, featureId: 'org_chart' },
    { label: 'Offboarding', href: '/offboarding', icon: UserMinus, featureId: 'offboarding' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ], [...typeNav, ...osNav]),
  hr: withOs([
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Employees', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Onboarding', href: '/onboarding', icon: UserPlus, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Goals', href: '/goals', icon: Target, featureId: 'performance' },
    { label: 'Compensation', href: '/compensation', icon: DollarSign, featureId: 'payroll' },
    { label: 'Benefits', href: '/benefits', icon: Gift, featureId: 'payroll' },
    { label: 'Surveys', href: '/surveys', icon: ClipboardList },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Expenses', href: '/expenses', icon: Wallet, featureId: 'expenses' },
    { label: 'Assets', href: '/assets', icon: Package, featureId: 'assets' },
    { label: 'Timesheets', href: '/timesheets', icon: FileText, featureId: 'timesheets' },
    { label: 'Org Chart', href: '/org-chart', icon: Network, featureId: 'org_chart' },
    { label: 'Offboarding', href: '/offboarding', icon: UserMinus, featureId: 'offboarding' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ], [...typeNav, ...osNav]),
  manager: withOs([
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'My Team', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Goals', href: '/goals', icon: Target, featureId: 'performance' },
    { label: 'Compensation', href: '/compensation', icon: DollarSign, featureId: 'payroll' },
    { label: 'Benefits', href: '/benefits', icon: Gift, featureId: 'payroll' },
    { label: 'Surveys', href: '/surveys', icon: ClipboardList },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Expenses', href: '/expenses', icon: Wallet, featureId: 'expenses' },
    { label: 'Timesheets', href: '/timesheets', icon: FileText, featureId: 'timesheets' },
    { label: 'Org Chart', href: '/org-chart', icon: Network, featureId: 'org_chart' },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]),
  employee: withOs([
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Directory', href: '/directory', icon: BookUser, featureId: 'employee_management' },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'My Schedule', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Benefits', href: '/benefits', icon: Gift, featureId: 'payroll' },
    { label: 'Goals', href: '/goals', icon: Target, featureId: 'performance' },
    { label: 'Surveys', href: '/surveys', icon: ClipboardList },
    { label: 'Expenses', href: '/expenses', icon: Wallet, featureId: 'expenses' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ], osNavEmployee),
  recruiter: withOs([
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]),
  trainee: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'qa-analyst': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Quality', href: '/qa-analyst/quality', icon: ShieldCheck },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'process-manager': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Performance', href: '/process-manager/performance', icon: TrendingUp, featureId: 'performance' },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'team-leader': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'My Team', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
   marketing: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  finance: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Expenses', href: '/expenses', icon: Wallet, featureId: 'expenses' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'it-manager': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'operations-manager': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  'account-manager': [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  guest: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ],
};

export const useNav = (role: string): NavItem[] => {
  const { isEnabled } = useFeatures();

  return useMemo(() => {
    const mainNav = navConfig[role] || [];
    
    // Filter by feature flags
    return mainNav.filter(item => {
        if (item.featureId) {
            return isEnabled(item.featureId);
        }
        return true;
    });
  }, [role, isEnabled]);
};
