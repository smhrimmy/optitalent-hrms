'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { MODULE_REGISTRY, navFeatureEnabled } from '@/lib/company-blueprint';

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
  | 'developer_tools'
  | 'offboarding'
  | 'factory'
  | 'stores'
  | 'credentials'
  | 'fleet'
  | 'sites'
  | 'faculty'
  | 'hospitality'
  | 'volunteers';

export interface Feature {
  id: FeatureModule;
  label: string;
  category: string;
  description: string;
  enabled: boolean;
}

interface FeaturesContextType {
  features: Feature[];
  toggleFeature: (id: FeatureModule) => void;
  isEnabled: (id: FeatureModule) => boolean;
  resetFeatures: () => void;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const db = useDataQuery();
  const company = db.company;

  const value = useMemo<FeaturesContextType>(() => {
    const features: Feature[] = MODULE_REGISTRY.filter((m) => m.navFeature).map((m) => ({
      id: m.navFeature as FeatureModule,
      label: m.label,
      category: m.category,
      description: m.description,
      enabled: navFeatureEnabled(company, m.navFeature as string),
    }));
    const seen = new Set<string>();
    const unique = features.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
    unique.push({
      id: 'developer_tools',
      label: 'Developer panel',
      category: 'Advanced',
      description: 'API keys and sandbox',
      enabled: true,
    });

    return {
      features: unique,
      isEnabled: (id: FeatureModule) => {
        if (id === 'developer_tools') return true;
        return navFeatureEnabled(company, id);
      },
      toggleFeature: (id: FeatureModule) => {
        MODULE_REGISTRY.filter((m) => m.navFeature === id).forEach((m) => dataQuery.toggleCompanyModule(m.id));
      },
      resetFeatures: () => {
        dataQuery.applyCompanyBlueprint(company);
      },
    };
  }, [company]);

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
}
