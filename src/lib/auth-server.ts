import { cookies, headers } from 'next/headers';
import { supabase } from './supabase';
import { cache } from 'react';

export interface CompanyContext {
  userId: string; // The session user ID
  identityId: string; // Platform identity ID
  companyId: string;
  companySlug: string;
  membershipId: string;
  roles: any[]; 
  permissions: string[]; 
  scopes: any[]; 
  legalEntityIds: string[];
  locationIds: string[];
  departmentIds: string[];
  featureFlags: Record<string, boolean>;
  enabledModules: string[];
  country: string;
  timezone: string;
  currency: string;
  platformRole: string;
  user: any;
}

// React Cache ensures this is only executed once per request lifecycle
export const getCompanyContext = cache(async (): Promise<CompanyContext | null> => {
  const headersList = await headers();
  
  // 1. Authenticate Identity
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    return null;
  }
  
  const userId = session.user.id;
  const identityId = userId; // In this schema, auth.users.id matches platform_identities.id

  // 2. Fetch Platform Identity
  const { data: identity } = await supabase
    .from('platform_identities')
    .select('platform_role')
    .eq('id', identityId)
    .single();
    
  const platformRole = identity?.platform_role || 'none';

  // 3. Determine Active Company Context
  const companySlug = headersList.get('x-company-slug');
  const manualCompanyId = headersList.get('x-company-id');
  
  let companyId = manualCompanyId;
  let companyData = null;
  
  if (!companyId && companySlug) {
      // Resolve slug to ID and fetch company config
      const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', companySlug)
          .single();
          
      if (company) {
          companyId = company.id;
          companyData = company;
      }
  } else if (companyId) {
      const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
      companyData = company;
  }

  // 4. Verify Membership (unless platform owner)
  let membershipId = '';
  let roles = [];
  let permissions: string[] = [];
  let scopes = [];
  let legalEntityIds: string[] = [];
  let locationIds: string[] = [];
  let departmentIds: string[] = [];
  
  if (companyId) {
      const { data: membership } = await supabase
          .from('company_memberships')
          .select('id, status, department_id, location_id')
          .eq('identity_id', identityId)
          .eq('company_id', companyId)
          .single();
          
      if (membership?.status === 'ACTIVE') {
          membershipId = membership.id;
          if (membership.department_id) departmentIds.push(membership.department_id);
          if (membership.location_id) locationIds.push(membership.location_id);
          
          // Fetch Roles and Permissions via role_assignments
          const { data: assignments } = await supabase
            .from('role_assignments')
            .select(`
              scope_type,
              roles (
                id,
                name,
                permissions (
                  resource,
                  action,
                  fields,
                  conditions
                )
              )
            `)
            .eq('membership_id', membershipId);
            
          if (assignments) {
             for (const assignment of assignments) {
                 if (assignment.roles) {
                     const roleData = assignment.roles as any;
                     roles.push(roleData);
                     if (roleData.permissions && Array.isArray(roleData.permissions)) {
                        permissions.push(...roleData.permissions);
                     }
                 }
                 if (assignment.scope_type) {
                     scopes.push(assignment.scope_type);
                 }
             }
             // We don't deduplicate here as they are objects, authorize() handles it
          }

      } else if (platformRole !== 'platform_owner') {
          // Access denied to this company
          return null;
      }
  } else {
      // No active company context, can only access global platform resources
      if (platformRole === 'none') {
          return null;
      }
  }

  return {
    userId,
    identityId,
    companyId: companyId || '',
    companySlug: companySlug || '',
    membershipId,
    roles,
    permissions,
    scopes,
    legalEntityIds,
    locationIds,
    departmentIds,
    featureFlags: companyData?.settings?.featureFlags || {},
    enabledModules: companyData?.settings?.enabledModules || [],
    country: companyData?.settings?.country || 'US',
    timezone: companyData?.settings?.timezone || 'UTC',
    currency: companyData?.settings?.currency || 'USD',
    platformRole,
    user: session.user
  };
});
