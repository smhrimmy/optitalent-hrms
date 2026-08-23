
# System Architecture & Design Analysis

## 1. Executive Summary
OptiTalent HRMS is a multi-tenant, enterprise-grade Human Resource Management System designed to serve multiple organizations (tenants) securely and efficiently. The platform provides a unified interface for Super Admins to manage the ecosystem and Tenant Admins to manage their respective organizations.

## 2. Core Architecture: Multi-Tenancy
The system implements a **Shared Database, Shared Schema** multi-tenancy model with Row-Level Security (RLS) for strict data isolation.

### 2.1 Tenant Isolation Strategy
- **Tenant ID**: Every major table (`users`, `employees`, `departments`, etc.) includes a `tenant_id` foreign key referencing the `tenants` table.
- **Row-Level Security (RLS)**: PostgreSQL RLS policies enforce isolation at the database layer. No query can access data outside the user's tenant context unless the user is a Super Admin.
- **Context Awareness**: A secure database function `get_tenant_id()` retrieves the current user's tenant context from their session for policy enforcement.

### 2.2 User Roles & Hierarchy
1.  **Super Admin (Platform Owner)**:
    *   Full access to all tenants and system-wide settings.
    *   Can suspend/activate tenants, manage plans, and view global analytics.
    *   Dashboard: `/super-admin`
2.  **Tenant Admin (Company Owner)**:
    *   Full control over their specific organization's data.
    *   Manage employees, departments, payroll, and settings.
    *   Dashboard: `/dashboard`
3.  **Employee / HR / Manager**:
    *   Role-based access within their tenant (e.g., HR can see all employee records, Managers see their team).

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI (Radix Primitives)
- **State Management**: React Context + SWR/TanStack Query (planned)
- **Animations**: Framer Motion + Lottie (for error pages)

### Backend (BaaS)
- **Platform**: Supabase
- **Database**: PostgreSQL
- **Auth**: Supabase Auth (JWT)
- **Storage**: Supabase Storage (for documents/avatars)
- **Edge Functions**: Supabase Edge Functions (for complex logic/cron jobs)

## 4. Security Architecture
- **Authentication**: Email/Password + OAuth (Google).
- **Authorization**: RBAC (Role-Based Access Control) via RLS policies.
- **Data Protection**:
    *   TLS 1.3 for data in transit.
    *   AES-256 encryption for data at rest (via Supabase/AWS).
- **Rate Limiting**: Implemented on critical endpoints (e.g., Login) with exponential backoff and `Retry-After` header handling.

## 5. Key Modules
1.  **Authentication**: Secure login/signup with role-based redirection and error handling.
2.  **Tenant Management**: Super Admin tools to onboard and manage companies.
3.  **Employee Management**: CRUD operations for employee profiles, hierarchy, and departments.
4.  **Operations**: Leave management, Helpdesk ticketing, and Payroll history.
5.  **Error System**: Comprehensive, animated error pages (404, 500, 403, 429) for better UX.

## 6. Deployment & DevOps
- **Hosting**: Vercel (Frontend) + Supabase (Backend).
- **CI/CD**: GitHub Actions (planned) / Vercel Auto-Deploy.
- **Monitoring**: Vercel Analytics + Supabase Logs.

## 7. Future Roadmap
- **Payroll Processing Engine**: Automated salary calculation and tax deduction.
- **AI Analytics**: Predictive insights for attrition and performance.
- **Mobile App**: React Native companion app for employees.
