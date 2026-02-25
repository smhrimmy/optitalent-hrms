
-- 1. Create Work Experience Table
CREATE TABLE IF NOT EXISTS public.work_experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means "Present"
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own work experience" 
  ON public.work_experience FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own work experience" 
  ON public.work_experience FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work experience" 
  ON public.work_experience FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work experience" 
  ON public.work_experience FOR DELETE 
  USING (auth.uid() = user_id);

-- HR/Admins can view all work experience in their tenant
CREATE POLICY "HR/Admins can view all work experience" 
  ON public.work_experience FOR SELECT 
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super-admin', 'admin', 'hr', 'recruiter')
    AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );


-- 2. Create Education Table
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

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own education" 
  ON public.education FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education" 
  ON public.education FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" 
  ON public.education FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" 
  ON public.education FOR DELETE 
  USING (auth.uid() = user_id);

-- HR/Admins can view all education in their tenant
CREATE POLICY "HR/Admins can view all education" 
  ON public.education FOR SELECT 
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super-admin', 'admin', 'hr', 'recruiter')
    AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );


-- 3. Create Attendance Table (Clock In/Out)
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  total_hours NUMERIC(5, 2),
  status TEXT DEFAULT 'Present', -- Present, Absent, Half-Day
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attendance" 
  ON public.attendance FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can clock in/out (insert/update)" 
  ON public.attendance FOR ALL 
  USING (auth.uid() = user_id);

-- HR/Admins/Managers can view all attendance in their tenant
CREATE POLICY "HR/Admins/Managers can view all attendance" 
  ON public.attendance FOR SELECT 
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super-admin', 'admin', 'hr', 'manager')
    AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
  );
