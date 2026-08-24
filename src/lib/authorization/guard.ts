import { NextResponse } from 'next/server';
import { getCompanyContext } from '../auth-server';
import { authorize } from './engine';

/**
 * Server-side Route Guard for App Router Layouts, Pages, and Server Actions.
 * Enforces multi-tenant RBAC policies dynamically.
 */
export async function requireAuth(resource: string, action: string) {
  const context = await getCompanyContext();
  
  if (!context) {
    return {
      allowed: false,
      // Generic redirect for unathenticated state
      redirect: '/login', 
      context: null
    };
  }

  // Evaluate against the authorization engine
  const result = authorize({
    context,
    resource,
    action
  });

  if (!result.allowed) {
    return {
      allowed: false,
      // Redirect to a specific denied/suspended screen if authenticated but lacks permission
      redirect: '/suspended',
      context
    };
  }

  return {
    allowed: true,
    redirect: null,
    context
  };
}
