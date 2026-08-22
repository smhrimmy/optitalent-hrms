'use client';

import { CompanyWizard } from '@/components/company/company-wizard';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SetupPage() {
  const { user } = useAuth();
  const role = user?.role || 'admin';
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={user ? `/${role}/dashboard` : '/login'}>Skip for now</Link>
        </Button>
      </div>
      <CompanyWizard afterApplyHref={user ? `/${role}/feature-matrix` : '/login'} />
    </div>
  );
}
