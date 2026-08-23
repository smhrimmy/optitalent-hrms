# RBAC Integration Audit

## 1. Resolution Mechanisms
- **Current User Resolution**: The user is currently resolved primarily on the client-side via `src/hooks/use-auth.tsx`, which relies on `supabase.auth.getSession()` or a fallback to `sessionStorage` (for mock data). On the server, there is no unified method for extracting the authenticated user session in the middleware or API routes.
- **Tenant ID Resolution**: `tenant_id` is extracted from the subdomain in the host header inside `src/middleware.ts` and set as the `x-tenant-id` header. However, this is not securely bound to the authenticated user's session token.
- **Role Resolution**: Roles are currently inferred from `session.user.user_metadata?.role`, querying the `users` table via `supabase` on the client side, or defaulting to `'employee'`. This is a frontend-driven check and is easily manipulated by the client.
- **Permissions and Scopes Resolution**: There is no active permission or scope resolution layer in place except for the foundational engine just introduced (`src/lib/permissions/index.ts`).
- **Field Restrictions**: Missing entirely. Sensitive fields are likely returned completely and merely hidden by React components.

## 2. Authorization Gaps
- **Frontend-only Authorization**:
  - `src/hooks/use-auth.tsx` controls redirection paths (`/${userToLogin.role}/dashboard`).
  - Navigation menus (`src/hooks/use-nav.ts`) are hidden based on roles.
  - UI buttons and routes are gated solely by checking the role string.
- **Missing Server Authorization**:
  - API Routes (`src/app/api/...`) do not currently enforce the new RBAC checks.
  - Server Actions (e.g. `src/app/actions.ts`) lack identity context checks and do not validate tenant bounds.
  - Data repositories (mock or Supabase) are queried directly without policy enforcement.
  - Supabase RLS is mentioned but not fully configured to map directly into our ABAC/RBAC scope architecture.
  - AI tools and Workflow code currently bypass server authorization boundaries.

## 3. Recommended Actions
- Adopt the new `PermissionService` universally.
- Centralize context building (user, tenant, role) at the edge (middleware / Next.js API layer).
- Filter fields prior to serialization at the repository layer.
- Enforce strict RLS in Supabase corresponding to our policies.
