'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoadingLogo } from '@/components/loading-logo';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(`/${user.role}/dashboard`);
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingLogo />
    </div>
  );
}
