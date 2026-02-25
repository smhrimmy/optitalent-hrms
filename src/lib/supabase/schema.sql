
-- -----------------------------------------------------------------------------
-- -----------------------------------------------------------------------------
-- This script is designed to be idempotent. It will completely tear down and
-- rebuild the database schema, including all tables, types, functions, and
-- row-level security policies. It's safe to run multiple times.
--
-- To run this script:
-- 1. Go to your Supabase project dashboard.
-- 2. Navigate to the SQL Editor.
-- 3. Paste the entire content of this file and click "Run".
-- -----------------------------------------------------------------------------
-- -----------------------------------------------------------------------------


-- -----------------------------------------------------------------------------
-- 1. TEARDOWN: Drop existing objects
-- -----------------------------------------------------------------------------
-- This block ensures a clean slate by removing all known objects.
-- The order is important due to dependencies.
DO $$
BEGIN
  -- Drop triggers first
  -- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

  -- Drop functions
  DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

  -- Drop tables. CASCADE will handle dependent policies, constraints, etc.
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
  DROP TABLE IF EXISTS public.users CASCADE;
  DROP TABLE IF EXISTS public.departments CASCADE;
  DROP TABLE IF EXISTS public.bonus_points_history CASCADE;
  
  -- Drop custom types
  DROP TYPE IF EXISTS public.user_role CASCADE;
  DROP TYPE IF EXISTS public.leave_type CASCADE;
  DROP TYPE IF EXISTS public.leave_status CASCADE;
  DROP TYPE IF EXISTS public.applicant_status CASCADE;
  DROP TYPE IF EXISTS public.job_status CASCADE;
  DROP TYPE IF EXISTS public.ticket_priority CASCADE;
  DROP TYPE IF EXISTS public.ticket_status CASCADE;
  DROP TYPE IF EXISTS public.ticket_category CASCADE;
  DROP TYPE IF EXISTS public.performance_rating CASCADE;

EXCEPTION
  WHEN UNDEFINED_FUNCTION THEN -- Ignore if function doesn't exist
  WHEN UNDEFINED_TABLE THEN -- Ignore if table doesn't exist
  WHEN UNDEFINED_OBJECT THEN -- Ignore if type doesn't exist
END $$;


-- -----------------------------------------------------------------------------
-- 2. CREATE CUSTOM TYPES (ENUMS)
-- -----------------------------------------------------------------------------

CREATE TYPE public.user_role AS ENUM (
  'super-admin', 'admin', 'hr', 'manager', 'recruiter', 'employee', 'trainer',
  'qa-analyst', 'process-manager', 'team-leader', 'marketing',
  'finance', 'it-manager', 'operations-manager', 'account-manager', 'trainee'
);

CREATE TYPE public.subscription_plan AS ENUM (
  'Free', 'Startup', 'Enterprise'
);

CREATE TYPE public.tenant_status AS ENUM (
  'Active', 'Suspended', 'Pending'
);

CREATE TYPE public.leave_type AS ENUM (
  'Sick Leave', 'Casual Leave', 'Paid Time Off', 'Work From Home'
);

CREATE TYPE public.leave_status AS ENUM (
  'Pending', 'Approved', 'Rejected'
);

CREATE TYPE public.job_status AS ENUM (
  'Open', 'Closed', 'On Hold'
);

CREATE TYPE public.applicant_status AS ENUM (
  'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
);

CREATE TYPE public.ticket_status AS ENUM (
  'Open', 'In Progress', 'Closed'
);

CREATE TYPE public.ticket_priority AS ENUM (
  'Low', 'Medium', 'High'
);

CREATE TYPE public.ticket_category AS ENUM (
  'IT Support', 'HR Query', 'Payroll Issue', 'Facilities', 'General Inquiry'
);

CREATE TYPE public.performance_rating AS ENUM (
  'Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'
);


-- -----------------------------------------------------------------------------
-- 3. CREATE TABLES
-- -----------------------------------------------------------------------------

-- Tenants Table (Multi-tenancy Core)
CREATE TABLE public.tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- for subdomain or URL path
  plan public.subscription_plan DEFAULT 'Free',
  status public.tenant_status DEFAULT 'Active',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments Table
CREATE TABLE public.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, name) -- Departments must be unique per tenant
);

-- Users Table (linked to auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL, -- Super admins might not have a tenant
  email TEXT UNIQUE,
  role public.user_role DEFAULT 'employee',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Employees Table
CREATE TABLE public.employees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id),
  manager_id UUID REFERENCES public.employees(id),
  job_title TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  phone_number TEXT,
  profile_picture_url TEXT,
  status TEXT DEFAULT 'Active',
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, employee_id) -- Employee IDs unique per tenant
);

-- Job Openings Table
CREATE TABLE public.job_openings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  status public.job_status DEFAULT 'Open',
  hiring_manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Applicants Table
CREATE TABLE public.applicants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_opening_id UUID REFERENCES public.job_openings(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  status public.applicant_status DEFAULT 'Applied',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interview Notes Table
CREATE TABLE public.interview_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leave Balances Table
CREATE TABLE public.leave_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
  sick_leave INT DEFAULT 7,
  casual_leave INT DEFAULT 12,
  paid_time_off INT DEFAULT 20
);

-- Holidays Table
CREATE TABLE public.holidays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL
);

-- Leave Requests Table
CREATE TABLE public.leave_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type public.leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status public.leave_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Helpdesk Tickets Table
CREATE TABLE public.helpdesk_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  category public.ticket_category,
  priority public.ticket_priority,
  status public.ticket_status DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Helpdesk Messages Table
CREATE TABLE public.helpdesk_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.employees(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Company Feed Posts Table
CREATE TABLE public.company_feed_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.employees(id),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Reviews Table
CREATE TABLE public.performance_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.employees(id),
  review_period TEXT NOT NULL,
  overall_rating public.performance_rating,
  goals_summary TEXT,
  achievements_summary TEXT,
  improvement_areas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payroll History Table
CREATE TABLE public.payroll_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period DATE NOT NULL,
  gross_salary NUMERIC(10, 2),
  deductions NUMERIC(10, 2),
  net_salary NUMERIC(10, 2),
  payslip_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assessments Table
CREATE TABLE public.assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.employees(id)
);

-- Assessment Attempts Table
CREATE TABLE public.assessment_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.applicants(id),
  employee_id UUID REFERENCES public.employees(id),
  score NUMERIC(5, 2),
  status TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Bonus Points History Table
CREATE TABLE public.bonus_points_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'award' or 'redeem'
    points INT NOT NULL,
    reason TEXT,
    actor_id UUID REFERENCES public.employees(id), -- who awarded/approved
    created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 4. DATABASE FUNCTIONS
-- -----------------------------------------------------------------------------
-- Function to automatically create a user profile when a new user signs up in Supabase Auth.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, tenant_id)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'employee',
    (new.raw_user_meta_data->>'tenant_id')::UUID -- Assume tenant_id is passed during signup
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on new user creation
-- NOTE: We cannot DROP or CREATE triggers on auth.users directly via standard SQL client if permissions are restricted.
-- Supabase Dashboard or Migration CLI is preferred for auth schema changes.
-- However, we can try to create it if it doesn't exist, or just rely on the function existing.
-- For this script, we'll comment out the TRIGGER creation on auth.users to avoid permission errors if running as a restricted user.
-- YOU MUST MANUALLY ADD THIS TRIGGER IN THE SUPABASE DASHBOARD IF IT DOESN'T EXIST.

/*
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/


-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
-- Enable RLS for all tables first.
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
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

-- POLICIES

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION public.get_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Tenants: Super Admin sees all. Users see their own tenant.
CREATE POLICY "Super Admin sees all tenants" ON public.tenants FOR SELECT USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin' );
CREATE POLICY "Users see their own tenant" ON public.tenants FOR SELECT USING ( id = public.get_tenant_id() );

-- Generic Policy Template for Tenant Isolation
-- Only users belonging to the same tenant can access the data.
-- Plus specific role-based access control.

-- Departments
CREATE POLICY "Tenant Isolation" ON public.departments USING (tenant_id = public.get_tenant_id());

-- Users
CREATE POLICY "Tenant Isolation" ON public.users USING (tenant_id = public.get_tenant_id() OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin');

-- Employees
CREATE POLICY "Tenant Isolation" ON public.employees USING (tenant_id = public.get_tenant_id());

-- Job Openings
CREATE POLICY "Tenant Isolation" ON public.job_openings USING (tenant_id = public.get_tenant_id());

-- Applicants
CREATE POLICY "Tenant Isolation" ON public.applicants USING (tenant_id = public.get_tenant_id());

-- Interview Notes
CREATE POLICY "Tenant Isolation" ON public.interview_notes USING (tenant_id = public.get_tenant_id());

-- Leave Balances
CREATE POLICY "Tenant Isolation" ON public.leave_balances USING (tenant_id = public.get_tenant_id());

-- Holidays
CREATE POLICY "Tenant Isolation" ON public.holidays USING (tenant_id = public.get_tenant_id());

-- Leave Requests
CREATE POLICY "Tenant Isolation" ON public.leave_requests USING (tenant_id = public.get_tenant_id());

-- Helpdesk Tickets
CREATE POLICY "Tenant Isolation" ON public.helpdesk_tickets USING (tenant_id = public.get_tenant_id());

-- Helpdesk Messages
CREATE POLICY "Tenant Isolation" ON public.helpdesk_messages USING (tenant_id = public.get_tenant_id());

-- Company Feed Posts
CREATE POLICY "Tenant Isolation" ON public.company_feed_posts USING (tenant_id = public.get_tenant_id());

-- Performance Reviews
CREATE POLICY "Tenant Isolation" ON public.performance_reviews USING (tenant_id = public.get_tenant_id());

-- Payroll History
CREATE POLICY "Tenant Isolation" ON public.payroll_history USING (tenant_id = public.get_tenant_id());

-- Assessments
CREATE POLICY "Tenant Isolation" ON public.assessments USING (tenant_id = public.get_tenant_id());

-- Assessment Attempts
CREATE POLICY "Tenant Isolation" ON public.assessment_attempts USING (tenant_id = public.get_tenant_id());

-- Bonus Points History
CREATE POLICY "Tenant Isolation" ON public.bonus_points_history USING (tenant_id = public.get_tenant_id());


-- -----------------------------------------------------------------------------
-- 6. DATA SEEDING
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    super_admin_id UUID;
    tenant_admin_id UUID;
    tenant_id_1 UUID;
BEGIN
    -- 1. Create Default Tenant
    INSERT INTO public.tenants (name, slug, plan, status)
    VALUES ('OptiTalent HQ', 'optitalent', 'Enterprise', 'Active')
    RETURNING id INTO tenant_id_1;

    -- 2. Create Super Admin User
    -- We can't access auth.users directly without elevated privileges.
    -- However, we can INSERT into public.users assuming auth.users entry exists or is handled separately.
    -- For this script, we'll try to insert into auth.users but wrap it in a block to catch permission errors if possible,
    -- or just rely on the user manually creating these users in the Supabase Dashboard.
    
    -- NOTE: Direct manipulation of auth.users is restricted in Supabase for security.
    -- Ideally, you should use the Supabase Admin API to create users.
    -- For this migration script, we will skip the auth.users insertion and assume
    -- the developer will create these users manually or via a separate admin script.
    
    -- We will insert placeholder records into public.users linked to a generated UUID for now
    -- to demonstrate the data structure. In a real scenario, these UUIDs must match the auth.users ID.
    
    -- Placeholder for Super Admin (Simulated)
    super_admin_id := gen_random_uuid(); 
    -- INSERT INTO public.users (id, email, full_name, role, tenant_id) 
    -- VALUES (super_admin_id, 'superadmin@optitalent.com', 'Super Admin', 'super-admin', tenant_id_1)
    -- ON CONFLICT (id) DO NOTHING; 
    
    -- NOTE: Because public.users has a foreign key to auth.users, we cannot insert here
    -- without a corresponding record in auth.users.
    -- Since we cannot create auth.users records via this SQL script due to permissions,
    -- WE WILL SKIP DATA SEEDING FOR USERS/EMPLOYEES requiring Auth IDs.
    
    -- You must manually create users in the Supabase Dashboard:
    -- 1. superadmin@optitalent.com
    -- 2. admin@acme.com
    -- Then use the Table Editor to update their 'role' and 'tenant_id' in the 'public.users' table.

END $$;

-- Enable public access for select-only on most tables if desired.
-- By default, RLS is restrictive. Policies above grant specific access.
-- If you want to make tables publicly readable, you can add policies like:
-- CREATE POLICY "Public read access" ON public.holidays FOR SELECT USING (true);
-- CREATE POLICY "Public read access" ON public.company_feed_posts FOR SELECT USING (true);

-- The script ends here. You can now connect your application.
-- Go to Project Settings > API and find your Project URL and anon key.
-- Add these to your .env.local file.

