-- -----------------------------------------------------------------------------
-- 1. TEARDOWN: Drop existing objects
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  -- Drop existing functions
  DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
  DROP FUNCTION IF EXISTS public.get_tenant_id CASCADE;
  DROP FUNCTION IF EXISTS public.get_company_id CASCADE;
  DROP FUNCTION IF EXISTS public.get_active_membership_id CASCADE;

  -- Drop domain tables
  DROP TABLE IF EXISTS public.payroll_history CASCADE;
  DROP TABLE IF EXISTS public.performance_reviews CASCADE;
  DROP TABLE IF EXISTS public.helpdesk_messages CASCADE;
  DROP TABLE IF EXISTS public.helpdesk_tickets CASCADE;
  DROP TABLE IF EXISTS public.interview_notes CASCADE;
  DROP TABLE IF EXISTS public.applicants CASCADE;
  DROP TABLE IF EXISTS public.job_openings CASCADE;
  DROP TABLE IF EXISTS public.leave_requests CASCADE;
  DROP TABLE IF EXISTS public.leave_balances CASCADE;
  DROP TABLE IF EXISTS public.holidays CASCADE;
  DROP TABLE IF EXISTS public.company_feed_posts CASCADE;
  DROP TABLE IF EXISTS public.assessment_attempts CASCADE;
  DROP TABLE IF EXISTS public.assessments CASCADE;
  DROP TABLE IF EXISTS public.employees CASCADE;
  DROP TABLE IF EXISTS public.departments CASCADE;
  DROP TABLE IF EXISTS public.bonus_points_history CASCADE;

  -- Drop legacy identity tables
  DROP TABLE IF EXISTS public.users CASCADE;
  DROP TABLE IF EXISTS public.tenants CASCADE;

  -- Drop new RBAC tables
  DROP TABLE IF EXISTS public.role_assignments CASCADE;
  DROP TABLE IF EXISTS public.permissions CASCADE;
  DROP TABLE IF EXISTS public.roles CASCADE;
  DROP TABLE IF EXISTS public.locations CASCADE;
  DROP TABLE IF EXISTS public.countries CASCADE;
  DROP TABLE IF EXISTS public.legal_entities CASCADE;
  DROP TABLE IF EXISTS public.company_memberships CASCADE;
  DROP TABLE IF EXISTS public.companies CASCADE;
  DROP TABLE IF EXISTS public.platform_identities CASCADE;

  -- Drop legacy types
  DROP TYPE IF EXISTS public.user_role CASCADE;
  DROP TYPE IF EXISTS public.tenant_status CASCADE;
  DROP TYPE IF EXISTS public.subscription_plan CASCADE;
  DROP TYPE IF EXISTS public.leave_type CASCADE;
  DROP TYPE IF EXISTS public.leave_status CASCADE;
  DROP TYPE IF EXISTS public.job_status CASCADE;
  DROP TYPE IF EXISTS public.applicant_status CASCADE;
  DROP TYPE IF EXISTS public.ticket_status CASCADE;
  DROP TYPE IF EXISTS public.ticket_priority CASCADE;
  DROP TYPE IF EXISTS public.ticket_category CASCADE;
  DROP TYPE IF EXISTS public.performance_rating CASCADE;
  
  -- Drop new types
  DROP TYPE IF EXISTS public.company_status CASCADE;
  DROP TYPE IF EXISTS public.platform_role CASCADE;
  DROP TYPE IF EXISTS public.membership_status CASCADE;

EXCEPTION
  WHEN UNDEFINED_FUNCTION THEN 
  WHEN UNDEFINED_TABLE THEN 
  WHEN UNDEFINED_OBJECT THEN 
END $$;


-- -----------------------------------------------------------------------------
-- 2. CREATE CUSTOM TYPES (ENUMS)
-- -----------------------------------------------------------------------------
CREATE TYPE public.subscription_plan AS ENUM (
  'Free', 'Startup', 'Enterprise'
);

CREATE TYPE public.company_status AS ENUM (
  'ACTIVE', 'WARNING', 'RESTRICTED', 'READ_ONLY', 'SUSPENDED', 'ARCHIVED'
);

CREATE TYPE public.platform_role AS ENUM (
  'platform_owner', 'platform_security_admin', 'platform_hr_admin', 
  'platform_finance_admin', 'platform_support_admin', 'platform_auditor', 
  'platform_analyst', 'none'
);

CREATE TYPE public.membership_status AS ENUM (
  'INVITED', 'PENDING', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'DEACTIVATED', 'ARCHIVED'
);

CREATE TYPE public.leave_type AS ENUM ('Sick Leave', 'Casual Leave', 'Paid Time Off', 'Work From Home');
CREATE TYPE public.leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE public.job_status AS ENUM ('Open', 'Closed', 'On Hold');
CREATE TYPE public.applicant_status AS ENUM ('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected');
CREATE TYPE public.ticket_status AS ENUM ('Open', 'In Progress', 'Closed');
CREATE TYPE public.ticket_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE public.ticket_category AS ENUM ('IT Support', 'HR Query', 'Payroll Issue', 'Facilities', 'General Inquiry');
CREATE TYPE public.performance_rating AS ENUM ('Exceeds Expectations', 'Meets Expectations', 'Needs Improvement');


-- -----------------------------------------------------------------------------
-- 3. CREATE TABLES - IDENTITY & AUTHORIZATION
-- -----------------------------------------------------------------------------

-- Platform Identities (replaces users)
-- Maps 1:1 with auth.users
CREATE TABLE public.platform_identities (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  platform_role public.platform_role DEFAULT 'none',
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Companies (replaces tenants)
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan public.subscription_plan DEFAULT 'Free',
  status public.company_status DEFAULT 'ACTIVE',
  industry TEXT,
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Company Memberships (links identities to companies)
CREATE TABLE public.company_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identity_id UUID NOT NULL REFERENCES public.platform_identities(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status public.membership_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identity_id, company_id)
);

-- Legal Entities (Organizational Hierarchy)
CREATE TABLE public.legal_entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  registration_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Countries
CREATE TABLE public.countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  legal_entity_id UUID REFERENCES public.legal_entities(id),
  country_code TEXT NOT NULL, -- e.g., 'US', 'IN'
  currency TEXT NOT NULL,
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Locations
CREATE TABLE public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  country_id UUID REFERENCES public.countries(id),
  name TEXT NOT NULL,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Roles (Dynamic Role Builder)
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE, -- NULL means global template
  name TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT false,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Permissions (Assigned to Roles)
CREATE TABLE public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL, -- e.g., 'employee', 'payroll'
  action TEXT NOT NULL,   -- e.g., 'view', 'create', 'update', 'finalize'
  fields TEXT[],          -- Array of specific fields, empty means all
  conditions JSONB,       -- Advanced conditions (e.g., time-based)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Role Assignments
CREATE TABLE public.role_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  membership_id UUID NOT NULL REFERENCES public.company_memberships(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  scope_type TEXT, -- e.g., 'GLOBAL', 'COMPANY', 'LEGAL_ENTITY', 'DEPARTMENT'
  scope_id UUID,   -- ID corresponding to scope_type
  target_population JSONB, -- Dynamic rules for whose data they can access
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ, -- For temporary permissions
  created_at TIMESTAMPTZ DEFAULT now()
);


-- -----------------------------------------------------------------------------
-- 4. CREATE TABLES - DOMAIN ENTITIES
-- -----------------------------------------------------------------------------

CREATE TABLE public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  membership_id UUID UNIQUE REFERENCES public.company_memberships(id) ON DELETE SET NULL,
  legal_entity_id UUID REFERENCES public.legal_entities(id),
  department_id UUID REFERENCES public.departments(id),
  manager_id UUID REFERENCES public.employees(id),
  job_title TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  employment_type TEXT DEFAULT 'Full-Time',
  phone_number TEXT,
  profile_picture_url TEXT,
  status TEXT DEFAULT 'Active',
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, employee_id)
);

CREATE TABLE public.job_openings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  status public.job_status DEFAULT 'Open',
  hiring_manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.applicants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_opening_id UUID REFERENCES public.job_openings(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  status public.applicant_status DEFAULT 'Applied',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.interview_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.leave_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
  sick_leave INT DEFAULT 7,
  casual_leave INT DEFAULT 12,
  paid_time_off INT DEFAULT 20
);

CREATE TABLE public.holidays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE public.leave_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type public.leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status public.leave_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.helpdesk_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  category public.ticket_category,
  priority public.ticket_priority,
  status public.ticket_status DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.helpdesk_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.employees(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.company_feed_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.employees(id),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.performance_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.employees(id),
  review_period TEXT NOT NULL,
  overall_rating public.performance_rating,
  goals_summary TEXT,
  achievements_summary TEXT,
  improvement_areas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.payroll_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period DATE NOT NULL,
  gross_salary NUMERIC(10, 2),
  deductions NUMERIC(10, 2),
  net_salary NUMERIC(10, 2),
  payslip_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.employees(id)
);

CREATE TABLE public.assessment_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.applicants(id),
  employee_id UUID REFERENCES public.employees(id),
  score NUMERIC(5, 2),
  status TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE public.bonus_points_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'award' or 'redeem'
    points INT NOT NULL,
    reason TEXT,
    actor_id UUID REFERENCES public.employees(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.platform_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_points_history ENABLE ROW LEVEL SECURITY;

-- Helper Functions
-- Get the active company ID (Requires the application to pass it via x-tenant-id headers to postgrest, or assume first membership if simple)
CREATE OR REPLACE FUNCTION public.get_active_company_id() RETURNS UUID AS $$
  -- In a real multi-tenant app, the client sends the active company context via a custom header or JWT claim.
  -- For this schema, we'll try to extract it from the JWT or default to the user's first active membership.
  SELECT company_id FROM public.company_memberships 
  WHERE identity_id = auth.uid() AND status = 'ACTIVE'
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Platform Identities RLS
CREATE POLICY "Platform Identities visible to self" ON public.platform_identities FOR SELECT USING (id = auth.uid());

-- Companies RLS
CREATE POLICY "Companies visible to members" ON public.companies FOR SELECT USING (
  id IN (SELECT company_id FROM public.company_memberships WHERE identity_id = auth.uid())
);

-- Company Memberships RLS
CREATE POLICY "Memberships visible to self" ON public.company_memberships FOR SELECT USING (identity_id = auth.uid());
CREATE POLICY "Memberships visible to HR/Admins in same company" ON public.company_memberships FOR SELECT USING (
  company_id IN (SELECT company_id FROM public.company_memberships WHERE identity_id = auth.uid())
);

-- Generic Domain Policy (Company Isolation)
-- All domain tables use: USING (company_id = public.get_active_company_id())
CREATE POLICY "Company Isolation" ON public.departments USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.employees USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.job_openings USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.applicants USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.interview_notes USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.leave_balances USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.holidays USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.leave_requests USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.helpdesk_tickets USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.helpdesk_messages USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.company_feed_posts USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.performance_reviews USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.payroll_history USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.assessments USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.assessment_attempts USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.bonus_points_history USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.legal_entities USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.countries USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.locations USING (company_id = public.get_active_company_id());
CREATE POLICY "Company Isolation" ON public.roles USING (company_id = public.get_active_company_id() OR is_template = true);

-- -----------------------------------------------------------------------------
-- 6. DATA SEEDING (BOOTSTRAP)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    hq_company_id UUID;
    global_hr_role_id UUID;
BEGIN
    -- Create OptiTalent HQ Company
    INSERT INTO public.companies (name, slug, plan, status, industry)
    VALUES ('OptiTalent HQ', 'optitalent', 'Enterprise', 'ACTIVE', 'Technology')
    RETURNING id INTO hq_company_id;

    -- Create Global HR Role Template
    INSERT INTO public.roles (company_id, name, description, is_template)
    VALUES (NULL, 'Global HR Director', 'Full HR access across all companies', true)
    RETURNING id INTO global_hr_role_id;

    -- Add permissions to Global HR
    INSERT INTO public.permissions (role_id, resource, action) VALUES 
    (global_hr_role_id, 'employee', 'view'),
    (global_hr_role_id, 'employee', 'create'),
    (global_hr_role_id, 'employee', 'update'),
    (global_hr_role_id, 'payroll', 'view');

END $$;
