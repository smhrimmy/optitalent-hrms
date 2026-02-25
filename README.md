# OptiTalent HRMS v2.0

OptiTalent is an enterprise-grade, multi-tenant Human Resource Management System (HRMS) designed to scale from startups to large corporations. Built with **Next.js 14**, **Supabase**, and **AI-powered features**, it provides a robust platform for managing the entire employee lifecycle.

## 📚 Documentation

Detailed documentation for the system architecture and features can be found in the `docs/` directory:

*   **[System Architecture](./docs/ARCHITECTURE_SPEC.md)**: High-level design, technology stack, security, and performance.
*   **[Database Schema](./docs/DATABASE_SCHEMA.md)**: Detailed reference for tables, relationships, and RLS policies.
*   **[Feature Specifications](./docs/FEATURE_SPECS.md)**: Breakdown of key modules (Auth, Recruitment, Payroll, etc.).

## 🚀 Key Features

### Multi-Tenancy
*   **True Data Isolation**: Shared database with strict Row-Level Security (RLS) enforcing tenant boundaries.
*   **Role-Based Access**: Granular permissions for Super Admins, Tenant Admins, HR, Managers, and Employees.
*   **Custom Subdomains**: (Planned) Support for `company.optitalent.com`.

### Core HR Modules
*   **Employee Management**: Centralized profiles, hierarchy visualization, and document storage.
*   **Recruitment (ATS)**: Job postings, applicant tracking, and interview management.
*   **Leave Management**: Configurable leave types, accruals, and approval workflows.
*   **Payroll**: Salary history, payslip generation, and tax tracking.
*   **Helpdesk**: Internal ticketing system for IT and HR support.

### AI-Powered (Genkit)
*   **Resume Parsing**: Automatically extract candidate details from PDFs.
*   **Smart Analytics**: Predictive insights for attrition and performance.
*   **HR Chatbot**: 24/7 assistant for policy questions.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
*   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
*   **AI**: Google Genkit (Gemini Models).
*   **Animation**: Framer Motion, Lottie.

## 🏁 Getting Started

### 1. Prerequisites
*   Node.js v20+
*   Supabase Project

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/smhrimmy/optitalent-hrms.git
cd optitalent-hrms

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Setup
Initialize the database schema and seed test data:

```bash
# Deploy Schema
npx tsx scripts/deploy-schema.ts

# Seed Multi-Tenant Data (3 Tenants: OptiTalent, Acme, Globex)
npx tsx src/lib/supabase/seed-multi-tenant.ts
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🔐 Default Credentials

**Super Admin**:
*   Email: `superadmin@optitalent.com`
*   Password: `password123`

**Tenant Admin (Acme Corp)**:
*   Email: `admin@acme.com`
*   Password: `password123`

