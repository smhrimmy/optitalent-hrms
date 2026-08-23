
# System Architecture Specification: OptiTalent HRMS v2.0

## 1. Executive Summary
OptiTalent HRMS v2.0 is a cloud-native, multi-tenant Software-as-a-Service (SaaS) platform designed for enterprise-grade Human Resource Management. This document outlines the architectural blueprint, technology stack, and security measures for the system.

## 2. System Architecture

### 2.1 Multi-Tenancy Model
The system employs a **Shared Database, Shared Schema** architecture with logical isolation via Row-Level Security (RLS). This approach maximizes resource efficiency while ensuring strict data separation.

*   **Tenant Identification**: Every primary entity (User, Employee, Department, etc.) is associated with a `tenant_id` (UUID).
*   **Data Isolation**: PostgreSQL RLS policies enforce tenant boundaries at the database layer. No application-level query can bypass this constraint.
*   **Scalability**: Supports thousands of tenants on a single database cluster, with potential for horizontal sharding in future iterations.

### 2.2 Core Components

#### A. Frontend Layer (Next.js 14+)
*   **Framework**: Next.js App Router (React Server Components).
*   **State Management**: React Context (Global UI State) + SWR/TanStack Query (Server State).
*   **UI System**: Shadcn UI (Radix Primitives) + Tailwind CSS.
*   **Authentication**: Supabase Auth (JWT) integrated via middleware.

#### B. Backend Layer (Supabase BaaS)
*   **Database**: PostgreSQL 15+ with pgvector support.
*   **API**: Auto-generated REST and GraphQL APIs via PostgREST.
*   **Authentication**: GoTrue (Supabase Auth) handling identity, sessions, and MFA.
*   **Storage**: Object storage for documents (resumes, contracts) and media (avatars).
*   **Edge Functions**: Deno-based serverless functions for complex business logic (e.g., payroll calculation, email notifications).

#### C. Infrastructure & DevOps
*   **Hosting**: Vercel (Frontend Edge Network).
*   **Database Hosting**: Supabase (AWS/Fly.io infrastructure).
*   **CI/CD**: GitHub Actions for automated testing and deployment.
*   **Monitoring**: Vercel Analytics + Supabase Logs + Sentry (Error Tracking).

## 3. Technology Stack Recommendations

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | SEO, Server Components, Edge Rendering. |
| **Language** | TypeScript 5.x | Type safety, developer productivity. |
| **Styling** | Tailwind CSS + Shadcn | Rapid UI development, consistency, accessibility. |
| **Database** | PostgreSQL | Reliability, RLS, JSONB support, Vector search. |
| **Auth** | Supabase Auth | Secure, scalable, supports OAuth/SSO. |
| **State** | Zustand / TanStack Query | Lightweight, efficient server-state synchronization. |
| **Forms** | React Hook Form + Zod | Performance, validation schema integration. |
| **Animation** | Framer Motion + Lottie | High-fidelity interactions, lightweight vector animations. |

## 4. Security Architecture

### 4.1 Authentication & Authorization
*   **JWT-Based**: Stateless authentication using JSON Web Tokens.
*   **RBAC (Role-Based Access Control)**:
    *   **Super Admin**: Platform-wide access.
    *   **Tenant Admin**: Full access within a specific tenant.
    *   **HR Manager**: Access to employee data and recruitment.
    *   **Employee**: Access to personal profile and self-service.
*   **MFA**: Optional Time-based One-Time Password (TOTP) enforcement for Admins.

### 4.2 Data Security
*   **Encryption at Rest**: AES-256 encryption for database volumes.
*   **Encryption in Transit**: TLS 1.3 for all API and database connections.
*   **RLS Policies**: "Defense in Depth" - database enforces access rules even if API layer has bugs.

### 4.3 Operational Security
*   **Audit Logging**: Track all critical actions (login, data modification) in an immutable `audit_logs` table.
*   **Rate Limiting**: API Gateway (Kong/Supabase) limits requests to prevent abuse/DDoS.

## 5. Performance & Scalability

### 5.1 Frontend Optimization
*   **Server Components**: Reduce client-side JavaScript bundle size.
*   **Image Optimization**: Next.js `<Image>` component for automatic resizing and WebP conversion.
*   **Code Splitting**: Dynamic imports for heavy components (e.g., Charts, Maps).
*   **Edge Caching**: Vercel Edge Network caches static assets and ISR pages.

### 5.2 Database Optimization
*   **Indexing**: B-Tree indexes on `tenant_id`, foreign keys, and frequently queried columns.
*   **Connection Pooling**: Supavisor for managing high-concurrency connections.
*   **Read Replicas**: Offload analytical queries (Reporting Dashboard) to read-only replicas.

## 6. Implementation Guidelines

1.  **Strict Typing**: All database types must be generated from the schema (`database.types.ts`).
2.  **Server Actions**: Prefer Server Actions for data mutations to ensure progressive enhancement.
3.  **Error Handling**: Use the centralized `ErrorPage` component for consistent UX.
4.  **Testing**:
    *   Unit Tests: Vitest for utility functions.
    *   Integration Tests: Playwright for critical flows (Login, Onboarding).

## 7. Success Metrics
*   **System Uptime**: 99.9% availability.
*   **API Latency**: < 200ms for 95th percentile.
*   **Lighthouse Score**: > 90 in Performance, Accessibility, and SEO.
*   **Security Incidents**: 0 critical vulnerabilities.
