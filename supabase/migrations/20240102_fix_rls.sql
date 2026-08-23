
-- Fix RLS for Job Openings
DROP POLICY IF EXISTS "Tenant Isolation" ON public.job_openings;
DROP POLICY IF EXISTS "View Jobs" ON public.job_openings;
DROP POLICY IF EXISTS "Manage Jobs" ON public.job_openings;

CREATE POLICY "View Jobs" ON public.job_openings
FOR SELECT
USING (tenant_id = public.get_tenant_id());

CREATE POLICY "Manage Jobs" ON public.job_openings
FOR ALL
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('recruiter', 'admin', 'super-admin', 'hr')
);

-- Fix RLS for Employees
DROP POLICY IF EXISTS "Tenant Isolation" ON public.employees;
DROP POLICY IF EXISTS "View Employees" ON public.employees;
DROP POLICY IF EXISTS "Manage Employees" ON public.employees;

CREATE POLICY "View Employees" ON public.employees
FOR SELECT
USING (tenant_id = public.get_tenant_id());

CREATE POLICY "Manage Employees" ON public.employees
FOR ALL
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'super-admin')
);

-- Fix RLS for Leave Requests
DROP POLICY IF EXISTS "Tenant Isolation" ON public.leave_requests;
DROP POLICY IF EXISTS "View Leave Requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Create Leave Request" ON public.leave_requests;
DROP POLICY IF EXISTS "Update Leave Request" ON public.leave_requests;

CREATE POLICY "View Leave Requests" ON public.leave_requests
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  )
);

CREATE POLICY "Create Leave Request" ON public.leave_requests
FOR INSERT
WITH CHECK (
  tenant_id = public.get_tenant_id() AND
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
);

CREATE POLICY "Update Leave Request" ON public.leave_requests
FOR UPDATE
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
);

-- Create Attendance Table (Missing in schema.sql)
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View Attendance" ON public.attendance;
CREATE POLICY "View Attendance" ON public.attendance
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    user_id = auth.uid() OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  )
);

DROP POLICY IF EXISTS "Clock In/Out" ON public.attendance;
CREATE POLICY "Clock In/Out" ON public.attendance
FOR INSERT
WITH CHECK (
  tenant_id = public.get_tenant_id() AND
  user_id = auth.uid()
);

DROP POLICY IF EXISTS "Update Attendance" ON public.attendance;
CREATE POLICY "Update Attendance" ON public.attendance
FOR UPDATE
USING (
  tenant_id = public.get_tenant_id() AND
  (
    user_id = auth.uid() OR -- For Clock Out
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  )
);

-- Fix RLS for Users
DROP POLICY IF EXISTS "Tenant Isolation" ON public.users;
DROP POLICY IF EXISTS "View Users" ON public.users;
DROP POLICY IF EXISTS "Manage Users" ON public.users;
DROP POLICY IF EXISTS "Delete Users" ON public.users;

CREATE POLICY "View Users" ON public.users
FOR SELECT
USING (tenant_id = public.get_tenant_id());

CREATE POLICY "Manage Users" ON public.users
FOR UPDATE
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'super-admin')
);

CREATE POLICY "Delete Users" ON public.users
FOR DELETE
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin'
);
