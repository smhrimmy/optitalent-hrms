'use client';

import { CompanyWizard } from '@/components/company/company-wizard';
import { useAuth } from '@/hooks/use-auth';

export default function CompanySetupPage() {
  const { user } = useAuth();
  return <CompanyWizard afterApplyHref={`/${user?.role || 'admin'}/feature-matrix`} />;
}
