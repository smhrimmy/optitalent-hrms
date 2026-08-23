
-- 1. Create Learning Tables

CREATE TABLE IF NOT EXISTS public.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_url TEXT, -- Link to video or doc
  duration_minutes INT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Not Started', -- Not Started, In Progress, Completed
  progress INT DEFAULT 0, -- 0 to 100
  assigned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, employee_id)
);

-- 2. Enable RLS

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Courses
DROP POLICY IF EXISTS "Tenant Isolation" ON public.courses;
CREATE POLICY "View Courses" ON public.courses
FOR SELECT
USING (tenant_id = public.get_tenant_id());

CREATE POLICY "Manage Courses" ON public.courses
FOR ALL
USING (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
);

-- Enrollments
DROP POLICY IF EXISTS "Tenant Isolation" ON public.course_enrollments;
CREATE POLICY "View Enrollments" ON public.course_enrollments
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'manager', 'trainer', 'super-admin')
  )
);

CREATE POLICY "Update Progress" ON public.course_enrollments
FOR UPDATE
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
  )
);

CREATE POLICY "Assign Courses" ON public.course_enrollments
FOR INSERT
WITH CHECK (
  tenant_id = public.get_tenant_id() AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'trainer', 'super-admin')
);

-- 4. Indexes

CREATE INDEX IF NOT EXISTS idx_courses_tenant_id ON public.courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_employee_id ON public.course_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments(course_id);
