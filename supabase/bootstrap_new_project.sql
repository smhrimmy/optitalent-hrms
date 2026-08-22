-- OptiTalent HRMS — complete schema for a new Supabase project
-- Paste into SQL Editor (Dashboard → SQL) or apply with psql against the
-- session-mode (non-pooling, port 5432) connection string.
-- Idempotent: safe to re-run on an empty or partial public schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
DO $$ BEGIN CREATE TYPE public.user_role AS ENUM (
  'super-admin', 'admin', 'hr', 'manager', 'recruiter', 'employee', 'trainer',
  'qa-analyst', 'process-manager', 'team-leader', 'marketing',
  'finance', 'it-manager', 'operations-manager', 'account-manager', 'trainee'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.subscription_plan AS ENUM (
  'Free', 'Startup', 'Enterprise'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.tenant_status AS ENUM (
  'Active', 'Suspended', 'Pending'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.leave_type AS ENUM (
  'Sick Leave', 'Casual Leave', 'Paid Time Off', 'Work From Home'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.leave_status AS ENUM (
  'Pending', 'Approved', 'Rejected'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.job_status AS ENUM (
  'Open', 'Closed', 'On Hold'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.applicant_status AS ENUM (
  'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.ticket_status AS ENUM (
  'Open', 'In Progress', 'Closed'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.ticket_priority AS ENUM (
  'Low', 'Medium', 'High'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.ticket_category AS ENUM (
  'IT Support', 'HR Query', 'Payroll Issue', 'Facilities', 'General Inquiry'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.performance_rating AS ENUM (
  'Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan public.subscription_plan DEFAULT 'Free',
  status public.tenant_status DEFAULT 'Active',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  email TEXT UNIQUE,
  role public.user_role DEFAULT 'employee',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employees (
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
  UNIQUE (tenant_id, employee_id)
);

CREATE TABLE IF NOT EXISTS public.job_openings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  status public.job_status DEFAULT 'Open',
  hiring_manager_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.applicants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_opening_id UUID REFERENCES public.job_openings(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  resume_data JSONB,
  status public.applicant_status DEFAULT 'Applied',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interview_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.applicants(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leave_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
  sick_leave INT DEFAULT 7,
  casual_leave INT DEFAULT 12,
  paid_time_off INT DEFAULT 20
);

CREATE TABLE IF NOT EXISTS public.holidays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
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

CREATE SEQUENCE IF NOT EXISTS public.helpdesk_ticket_seq START 1000;

CREATE TABLE IF NOT EXISTS public.helpdesk_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  category public.ticket_category,
  priority public.ticket_priority,
  status public.ticket_status DEFAULT 'Open',
  ticket_number INTEGER DEFAULT nextval('public.helpdesk_ticket_seq'),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.helpdesk_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.employees(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_feed_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.employees(id),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id),
  review_period TEXT NOT NULL,
  overall_rating public.performance_rating,
  goals_summary TEXT,
  achievements_summary TEXT,
  improvement_areas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period DATE NOT NULL,
  gross_salary NUMERIC(10, 2),
  deductions NUMERIC(10, 2),
  net_salary NUMERIC(10, 2),
  status TEXT DEFAULT 'Pending',
  payslip_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.employees(id)
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
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

CREATE TABLE IF NOT EXISTS public.bonus_points_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  points INT NOT NULL,
  reason TEXT,
  actor_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.work_experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  total_hours NUMERIC(5, 2),
  status TEXT DEFAULT 'Present',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_url TEXT,
  duration_minutes INT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Not Started',
  progress INT DEFAULT 0,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (course_id, employee_id)
);

CREATE TABLE IF NOT EXISTS public.walkin_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Walk-In Drive',
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  content TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  experience_level TEXT,
  description TEXT,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'Starter',
  status TEXT DEFAULT 'Active',
  user_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  run_label TEXT NOT NULL,
  pay_period_start DATE,
  pay_period_end DATE,
  total_employees INT DEFAULT 0,
  total_amount NUMERIC(14, 2) DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_heartbeat (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_ping_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ping_count BIGINT NOT NULL DEFAULT 0,
  source TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.app_heartbeat (id, source)
VALUES (1, 'bootstrap')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tenants (name, slug, plan, status)
VALUES ('OptiTalent HQ', 'optitalent', 'Enterprise', 'Active')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_tenant uuid;
  meta_role public.user_role;
BEGIN
  BEGIN
    meta_tenant := NULLIF(NEW.raw_user_meta_data->>'tenant_id', '')::uuid;
  EXCEPTION WHEN OTHERS THEN
    meta_tenant := NULL;
  END;
  BEGIN
    meta_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role, 'employee');
  EXCEPTION WHEN OTHERS THEN
    meta_role := 'employee';
  END;

  INSERT INTO public.users (id, email, full_name, role, tenant_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    meta_role,
    meta_tenant
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_heartbeat(p_source text DEFAULT 'rpc')
RETURNS public.app_heartbeat
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.app_heartbeat;
BEGIN
  UPDATE public.app_heartbeat
  SET last_ping_at = now(),
      ping_count = ping_count + 1,
      source = p_source,
      updated_at = now()
  WHERE id = 1
  RETURNING * INTO row;
  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_tenant_id() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.touch_heartbeat(text) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON public.users (tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_id ON public.employees (tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees (user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees (department_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id_date ON public.attendance (user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant_id_date ON public.attendance (tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON public.leave_requests (employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant_id_status ON public.leave_requests (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll_history (employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_tenant_id_period ON public.payroll_history (tenant_id, pay_period);
CREATE INDEX IF NOT EXISTS idx_performance_employee_id ON public.performance_reviews (employee_id);
CREATE INDEX IF NOT EXISTS idx_applicants_tenant_id_status ON public.applicants (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_tenant_id ON public.courses (tenant_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee_id ON public.course_enrollments (employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
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
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walkin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_heartbeat ENABLE ROW LEVEL SECURITY;

-- Recreate named policies (idempotent)
DROP POLICY IF EXISTS "Super Admin sees all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users see their own tenant" ON public.tenants;
CREATE POLICY "Super Admin sees all tenants" ON public.tenants FOR SELECT
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin');
CREATE POLICY "Users see their own tenant" ON public.tenants FOR SELECT
  USING (id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.departments;
CREATE POLICY "Tenant Isolation" ON public.departments
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "View Users" ON public.users;
DROP POLICY IF EXISTS "Manage Users" ON public.users;
DROP POLICY IF EXISTS "Delete Users" ON public.users;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.users;
CREATE POLICY "View Users" ON public.users FOR SELECT
  USING (
    id = auth.uid()
    OR tenant_id = public.get_tenant_id()
    OR (SELECT role FROM public.users u WHERE u.id = auth.uid()) = 'super-admin'
  );
CREATE POLICY "Manage Users" ON public.users FOR UPDATE
  USING (
    id = auth.uid()
    OR (
      tenant_id = public.get_tenant_id()
      AND (SELECT role FROM public.users u WHERE u.id = auth.uid()) IN ('admin', 'super-admin')
    )
  );
CREATE POLICY "Delete Users" ON public.users FOR DELETE
  USING ((SELECT role FROM public.users u WHERE u.id = auth.uid()) = 'super-admin');

DROP POLICY IF EXISTS "View Employees" ON public.employees;
DROP POLICY IF EXISTS "Manage Employees" ON public.employees;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.employees;
CREATE POLICY "View Employees" ON public.employees FOR SELECT
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Manage Employees" ON public.employees FOR ALL
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'super-admin')
  );

DROP POLICY IF EXISTS "View Jobs" ON public.job_openings;
DROP POLICY IF EXISTS "Manage Jobs" ON public.job_openings;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.job_openings;
CREATE POLICY "View Jobs" ON public.job_openings FOR SELECT
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Manage Jobs" ON public.job_openings FOR ALL
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('recruiter', 'admin', 'super-admin', 'hr')
  );

DROP POLICY IF EXISTS "Tenant Isolation" ON public.applicants;
CREATE POLICY "Tenant Isolation" ON public.applicants
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.interview_notes;
CREATE POLICY "Tenant Isolation" ON public.interview_notes
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.leave_balances;
CREATE POLICY "Tenant Isolation" ON public.leave_balances FOR ALL
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.holidays;
CREATE POLICY "Tenant Isolation" ON public.holidays
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "View Leave Requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Create Leave Request" ON public.leave_requests;
DROP POLICY IF EXISTS "Update Leave Request" ON public.leave_requests;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.leave_requests;
CREATE POLICY "View Leave Requests" ON public.leave_requests FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
    )
  );
CREATE POLICY "Create Leave Request" ON public.leave_requests FOR INSERT
  WITH CHECK (
    tenant_id = public.get_tenant_id()
    AND employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );
CREATE POLICY "Update Leave Request" ON public.leave_requests FOR UPDATE
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  );

DROP POLICY IF EXISTS "View Tickets" ON public.helpdesk_tickets;
DROP POLICY IF EXISTS "Create Tickets" ON public.helpdesk_tickets;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.helpdesk_tickets;
CREATE POLICY "View Tickets" ON public.helpdesk_tickets FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'it-manager', 'super-admin')
    )
  );
CREATE POLICY "Create Tickets" ON public.helpdesk_tickets FOR INSERT
  WITH CHECK (
    tenant_id = public.get_tenant_id()
    AND employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "View Messages" ON public.helpdesk_messages;
DROP POLICY IF EXISTS "Create Messages" ON public.helpdesk_messages;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.helpdesk_messages;
CREATE POLICY "View Messages" ON public.helpdesk_messages FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND EXISTS (
      SELECT 1 FROM public.helpdesk_tickets t
      WHERE t.id = ticket_id
        AND (
          t.employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
          OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'it-manager', 'super-admin')
        )
    )
  );
CREATE POLICY "Create Messages" ON public.helpdesk_messages FOR INSERT
  WITH CHECK (
    tenant_id = public.get_tenant_id()
    AND sender_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "View Feed" ON public.company_feed_posts;
DROP POLICY IF EXISTS "Post Feed" ON public.company_feed_posts;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.company_feed_posts;
CREATE POLICY "View Feed" ON public.company_feed_posts FOR SELECT
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Post Feed" ON public.company_feed_posts FOR INSERT
  WITH CHECK (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "View Reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Manage Reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.performance_reviews;
CREATE POLICY "View Reviews" ON public.performance_reviews FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR reviewer_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
    )
  );
CREATE POLICY "Manage Reviews" ON public.performance_reviews FOR ALL
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  );

DROP POLICY IF EXISTS "View Payroll" ON public.payroll_history;
DROP POLICY IF EXISTS "Manage Payroll" ON public.payroll_history;
DROP POLICY IF EXISTS "Tenant Isolation" ON public.payroll_history;
CREATE POLICY "View Payroll" ON public.payroll_history FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'finance', 'super-admin', 'hr')
    )
  );
CREATE POLICY "Manage Payroll" ON public.payroll_history FOR ALL
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'finance', 'super-admin')
  );

DROP POLICY IF EXISTS "Tenant Isolation" ON public.assessments;
CREATE POLICY "Tenant Isolation" ON public.assessments
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.assessment_attempts;
CREATE POLICY "Tenant Isolation" ON public.assessment_attempts
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Tenant Isolation" ON public.bonus_points_history;
CREATE POLICY "Tenant Isolation" ON public.bonus_points_history
  USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Users can view their own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can insert their own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can update their own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can delete their own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "HR/Admins can view all work experience" ON public.work_experience;
CREATE POLICY "Users can view their own work experience" ON public.work_experience FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own work experience" ON public.work_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own work experience" ON public.work_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own work experience" ON public.work_experience FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "HR/Admins can view all work experience" ON public.work_experience FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super-admin', 'admin', 'hr', 'recruiter')
    AND tenant_id = public.get_tenant_id()
  );

DROP POLICY IF EXISTS "Users can view their own education" ON public.education;
DROP POLICY IF EXISTS "Users can insert their own education" ON public.education;
DROP POLICY IF EXISTS "Users can update their own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete their own education" ON public.education;
DROP POLICY IF EXISTS "HR/Admins can view all education" ON public.education;
CREATE POLICY "Users can view their own education" ON public.education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own education" ON public.education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own education" ON public.education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own education" ON public.education FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "HR/Admins can view all education" ON public.education FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super-admin', 'admin', 'hr', 'recruiter')
    AND tenant_id = public.get_tenant_id()
  );

DROP POLICY IF EXISTS "View Attendance" ON public.attendance;
DROP POLICY IF EXISTS "Clock In/Out" ON public.attendance;
DROP POLICY IF EXISTS "Update Attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can clock in/out (insert/update)" ON public.attendance;
DROP POLICY IF EXISTS "HR/Admins/Managers can view all attendance" ON public.attendance;
CREATE POLICY "View Attendance" ON public.attendance FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      user_id = auth.uid()
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
    )
  );
CREATE POLICY "Clock In/Out" ON public.attendance FOR INSERT
  WITH CHECK (tenant_id = public.get_tenant_id() AND user_id = auth.uid());
CREATE POLICY "Update Attendance" ON public.attendance FOR UPDATE
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      user_id = auth.uid()
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
    )
  );

DROP POLICY IF EXISTS "View Courses" ON public.courses;
DROP POLICY IF EXISTS "Manage Courses" ON public.courses;
CREATE POLICY "View Courses" ON public.courses FOR SELECT
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Manage Courses" ON public.courses FOR ALL
  USING (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
  );

DROP POLICY IF EXISTS "View Enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Update Progress" ON public.course_enrollments;
DROP POLICY IF EXISTS "Assign Courses" ON public.course_enrollments;
CREATE POLICY "View Enrollments" ON public.course_enrollments FOR SELECT
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'trainer', 'super-admin')
    )
  );
CREATE POLICY "Update Progress" ON public.course_enrollments FOR UPDATE
  USING (
    tenant_id = public.get_tenant_id()
    AND (
      employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
      OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
    )
  );
CREATE POLICY "Assign Courses" ON public.course_enrollments FOR INSERT
  WITH CHECK (
    tenant_id = public.get_tenant_id()
    AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
  );

DROP POLICY IF EXISTS "Allow public read access to active events" ON public.walkin_events;
DROP POLICY IF EXISTS "Allow authenticated users to view all events for their tenant" ON public.walkin_events;
DROP POLICY IF EXISTS "Allow recruiters/admins to manage events" ON public.walkin_events;
CREATE POLICY "Allow public read access to active events" ON public.walkin_events FOR SELECT
  USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all events for their tenant" ON public.walkin_events FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND tenant_id = walkin_events.tenant_id));
CREATE POLICY "Allow recruiters/admins to manage events" ON public.walkin_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('admin', 'super-admin', 'recruiter')
        AND tenant_id = walkin_events.tenant_id
    )
  );

DROP POLICY IF EXISTS "Own notifications" ON public.notifications;
CREATE POLICY "Own notifications" ON public.notifications FOR ALL
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Tenant job listings" ON public.job_listings;
CREATE POLICY "Tenant job listings" ON public.job_listings FOR ALL
  USING (tenant_id IS NULL OR tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id IS NULL OR tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Authenticated companies" ON public.companies;
CREATE POLICY "Authenticated companies" ON public.companies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Tenant payroll runs" ON public.payroll_runs;
CREATE POLICY "Tenant payroll runs" ON public.payroll_runs FOR ALL
  USING (tenant_id IS NULL OR tenant_id = public.get_tenant_id())
  WITH CHECK (tenant_id IS NULL OR tenant_id = public.get_tenant_id());

-- Heartbeat is only touched via security-definer RPC / service role.
DROP POLICY IF EXISTS "No direct heartbeat access" ON public.app_heartbeat;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.walkin_events TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Realtime + storage
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('helpdesk-attachments', 'helpdesk-attachments', false),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated upload helpdesk attachments" ON storage.objects;
CREATE POLICY "Authenticated upload helpdesk attachments" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'helpdesk-attachments');

DROP POLICY IF EXISTS "Authenticated read helpdesk attachments" ON storage.objects;
CREATE POLICY "Authenticated read helpdesk attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'helpdesk-attachments');

DROP POLICY IF EXISTS "Authenticated upload resumes" ON storage.objects;
CREATE POLICY "Authenticated upload resumes" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Authenticated read resumes" ON storage.objects;
CREATE POLICY "Authenticated read resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'resumes');
