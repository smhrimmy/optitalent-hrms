
-- Security Hardening & RLS Policies

-- 1. Company Feed
ALTER TABLE public.company_feed_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View Feed" ON public.company_feed_posts;
CREATE POLICY "View Feed" ON public.company_feed_posts
FOR SELECT
USING (tenant_id = public.get_tenant_id());

DROP POLICY IF EXISTS "Post Feed" ON public.company_feed_posts;
CREATE POLICY "Post Feed" ON public.company_feed_posts
FOR INSERT
WITH CHECK (tenant_id = public.get_tenant_id());

-- 2. Helpdesk Tickets
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View Tickets" ON public.helpdesk_tickets;
CREATE POLICY "View Tickets" ON public.helpdesk_tickets
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'it-manager', 'super-admin')
  )
);

DROP POLICY IF EXISTS "Create Tickets" ON public.helpdesk_tickets;
CREATE POLICY "Create Tickets" ON public.helpdesk_tickets
FOR INSERT
WITH CHECK (
  tenant_id = public.get_tenant_id() AND
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
);

-- 3. Helpdesk Messages
ALTER TABLE public.helpdesk_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View Messages" ON public.helpdesk_messages;
CREATE POLICY "View Messages" ON public.helpdesk_messages
FOR SELECT
USING (
  tenant_id = public.get_tenant_id() AND
  EXISTS (
    SELECT 1 FROM public.helpdesk_tickets t
    WHERE t.id = ticket_id AND
    (
      t.employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
      (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'hr', 'it-manager', 'super-admin')
    )
  )
);

DROP POLICY IF EXISTS "Create Messages" ON public.helpdesk_messages;
CREATE POLICY "Create Messages" ON public.helpdesk_messages
FOR INSERT
WITH CHECK (
  tenant_id = public.get_tenant_id() AND
  sender_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
);
