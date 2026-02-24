
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FeatureModule = 
  | 'employee_management'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'performance'
  | 'recruitment'
  | 'timesheets'
  | 'training'
  | 'expenses'
  | 'assets'
  | 'org_chart'
  | 'compliance'
  | 'ai_tools'
  | 'developer_tools';

export interface Feature {
  id: FeatureModule;
  label: string;
  category: 'Core' | 'Talent' | 'Finance' | 'Operations' | 'Advanced';
  description: string;
  enabled: boolean;
}

const defaultFeatures: Feature[] = [
  { id: 'employee_management', label: 'Employee Management', category: 'Core', description: 'Profiles, Directory, Documents', enabled: true },
  { id: 'attendance', label: 'Attendance & Time', category: 'Operations', description: 'Check-in/out, Shifts, Logs', enabled: true },
  { id: 'leave', label: 'Leave & Holidays', category: 'Operations', description: 'Leave requests, Calendars, Balances', enabled: true },
  { id: 'payroll', label: 'Payroll & Compensation', category: 'Finance', description: 'Salary, Payslips, Tax', enabled: true },
  { id: 'performance', label: 'Performance Management', category: 'Talent', description: 'Goals, Reviews, OKRs', enabled: true },
  { id: 'recruitment', label: 'Recruitment (ATS)', category: 'Talent', description: 'Jobs, Pipeline, Offers', enabled: true },
  { id: 'timesheets', label: 'Timesheets & Projects', category: 'Operations', description: 'Project tracking, Billable hours', enabled: false },
  { id: 'training', label: 'Training & Learning', category: 'Talent', description: 'Courses, Certifications', enabled: false },
  { id: 'expenses', label: 'Expense & Claims', category: 'Finance', description: 'Reimbursements, Approvals', enabled: false },
  { id: 'assets', label: 'Assets & Inventory', category: 'Operations', description: 'Hardware allocation, Tracking', enabled: false },
  { id: 'org_chart', label: 'Org Charts', category: 'Core', description: 'Visual hierarchy builder', enabled: true },
  { id: 'compliance', label: 'Compliance & Audit', category: 'Advanced', description: 'Logs, GDPR, Data retention', enabled: true },
  { id: 'ai_tools', label: 'AI Tools', category: 'Advanced', description: 'Career Predictor, Chatbot', enabled: true },
  { id: 'developer_tools', label: 'Developer Panel', category: 'Advanced', description: 'API Keys, Webhooks, Sandbox', enabled: true },
];

interface FeaturesContextType {
  features: Feature[];
  toggleFeature: (id: FeatureModule) => void;
  isEnabled: (id: FeatureModule) => boolean;
  resetFeatures: () => void;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    try {
      const stored = localStorage.getItem('hrms_features');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default to ensure new features appear
        const merged = defaultFeatures.map(df => {
            const found = parsed.find((p: Feature) => p.id === df.id);
            return found ? found : df;
        });
        setFeatures(merged);
      }
    } catch (e) {
      console.error("Failed to load features settings", e);
    } finally {
        setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
        localStorage.setItem('hrms_features', JSON.stringify(features));
    }
  }, [features, loaded]);

  const toggleFeature = (id: FeatureModule) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const isEnabled = (id: FeatureModule) => {
    return features.find(f => f.id === id)?.enabled ?? false;
  };

  const resetFeatures = () => {
      setFeatures(defaultFeatures);
  }

  return (
    <FeaturesContext.Provider value={{ features, toggleFeature, isEnabled, resetFeatures }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
}
