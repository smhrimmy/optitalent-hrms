
-- 1. Create Tables if not exist (Idempotent)

CREATE TABLE IF NOT EXISTS public.leave_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  sick_leave INT DEFAULT 7,
  casual_leave INT DEFAULT 12,
  paid_time_off INT DEFAULT 20,
  UNIQUE(employee_id)
);

CREATE TABLE IF NOT EXISTS public.payroll_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period DATE NOT NULL,
  gross_salary NUMERIC(10, 2),
  deductions NUMERIC(10, 2),
  net_salary NUMERIC(10, 2),
  status TEXT DEFAULT 'Pending', -- Paid, Pending, Failed
  payslip_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id),
  review_period TEXT NOT NULL,
  overall_rating TEXT, -- Exceeds Expectations, Meets Expectations, Needs Improvement
  goals_summary TEXT,
  achievements_summary TEXT,
  improvement_areas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS

ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Leave Balances
DROP POLICY IF EXISTS "Tenant Isolation" ON public.leave_balances;
CREATE POLICY "Tenant Isolation" ON public.leave_balances
FOR ALL
USING (tenant_id = public.get_tenant_id());

-- Payroll History
DROP POLICY IF EXISTS "Tenant Isolation" ON public.payroll_history;
CREATE POLICY "View Payroll" ON public.payroll_history
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'finance', 'super-admin', 'hr')
  )
);

CREATE POLICY "Manage Payroll" ON public.payroll_history
FOR ALL
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'finance', 'super-admin')
);

-- Performance Reviews
DROP POLICY IF EXISTS "Tenant Isolation" ON public.performance_reviews;
CREATE POLICY "View Reviews" ON public.performance_reviews
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    reviewer_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
  )
);

CREATE POLICY "Manage Reviews" ON public.performance_reviews
FOR ALL
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'super-admin')
);

-- 4. Performance Indexes (The "Snap of a finger" part)

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

CREATE INDEX IF NOT EXISTS idx_employees_tenant_id ON public.employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);

CREATE INDEX IF NOT EXISTS idx_attendance_user_id_date ON public.attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant_id_date ON public.attendance(tenant_id, date);

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant_id_status ON public.leave_requests(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_tenant_id_period ON public.payroll_history(tenant_id, pay_period);

CREATE INDEX IF NOT EXISTS idx_performance_employee_id ON public.performance_reviews(employee_id);

CREATE INDEX IF NOT EXISTS idx_applicants_tenant_id_status ON public.applicants(tenant_id, status);
