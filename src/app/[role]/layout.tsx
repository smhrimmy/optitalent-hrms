'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function RoleLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const role = params.role as string;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    const privileged = ['admin', 'super-admin', 'hr'].includes(user.role);
    if (role && role !== user.role && !privileged) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [loading, user, role, router]);

  if (loading || !user) return <>{children}</>;
  return <>{children}</>;
}
