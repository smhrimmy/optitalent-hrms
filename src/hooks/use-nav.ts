
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
  Building,
  Target,
  Factory,
  Activity,
  Server,
  ShieldCheck,
  Database,
  Puzzle,
  BookOpen,
  TrendingUp,
  Handshake,
  GraduationCap,
  CalendarOff,
  Newspaper,
  Clock,
  Heart,
  BrainCircuit,
  Sliders,
  Code
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
  '/admin-config': 'developer_tools', // Or just available for admin
  '/developer-panel': 'developer_tools',
};

export const navConfig: Record<string, NavItem[]> = {
  'super-admin': [
    { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
    { label: 'Server Status', href: '/super-admin/server-health', icon: Activity },
    { label: 'Security Center', href: '/super-admin/security', icon: ShieldCheck },
    { label: 'Tenant Accounts', href: '/super-admin/tenants', icon: Users },
    { label: 'Backups & DR', href: '/super-admin/backups', icon: Database },
    { label: 'Global Settings', href: '/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Server Status', href: '/super-admin/server-health', icon: Activity }, // New WHM
    { label: 'Security Center', href: '/super-admin/security', icon: ShieldCheck }, // New WHM
    { label: 'Tenant Accounts', href: '/super-admin/tenants', icon: Users }, // Enhanced
    { label: 'Feature Config', href: '/admin-config', icon: Sliders }, 
    { label: 'Developer Panel', href: '/developer-panel', icon: Code, featureId: 'developer_tools' }, 
    { label: 'Backups & DR', href: '/super-admin/backups', icon: Database }, // Existing
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Employees', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Onboarding', href: '/onboarding', icon: UserPlus, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  hr: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Employees', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Onboarding', href: '/onboarding', icon: UserPlus, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  manager: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'My Team', href: '/employees', icon: Users, featureId: 'employee_management' },
    { label: 'Performance', href: '/performance', icon: Award, featureId: 'performance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'Shifts', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  employee: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leaves', href: '/leaves', icon: CalendarOff, featureId: 'leave' },
    { label: 'My Schedule', href: '/shifts', icon: Clock, featureId: 'attendance' },
    { label: 'Attendance', href: '/attendance', icon: Calendar, featureId: 'attendance' },
    { label: 'Learning', href: '/learning', icon: GraduationCap, featureId: 'training' },
    { label: 'Recognition', href: '/recognition', icon: Heart },
    { label: 'Payroll', href: '/payroll', icon: DollarSign, featureId: 'payroll' },
    { label: 'Helpdesk', href: '/helpdesk', icon: HelpCircle },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  // ... (Other roles can be added similarly, keeping existing config for brevity but applying filtering)
  recruiter: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart2 },
    { label: 'Recruitment', href: '/recruitment', icon: Briefcase, featureId: 'recruitment' },
    { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
    { label: 'AI Tools', href: '/ai-tools/chatbot', icon: AnimatedBot, featureId: 'ai_tools' },
    { label: 'Company Feed', href: '/company-feed', icon: Newspaper },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
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
